using System.IdentityModel.Tokens.Jwt;
using System.Net.Mail;
using System.Net.Mime;
using System.Security.Claims;
using System.Text;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.HttpLogging;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;
using WebApi;
using WebApi.Database;
using WebApi.Domain;
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(
	options =>
	{
		options.SwaggerDoc("v1", new OpenApiInfo { Title = "WebApi", Version = "v1" });

		options.AddSecurityDefinition(
			"Bearer",
			new OpenApiSecurityScheme
			{
				Description = "JWT Authorization header using the Bearer scheme.",
				Name = "Authorization",
				In = ParameterLocation.Header,
				Type = SecuritySchemeType.Http,
				Scheme = "bearer",
				BearerFormat = "JWT",
			});

		options.AddSecurityRequirement(
			new OpenApiSecurityRequirement
			{
				{
					new OpenApiSecurityScheme
					{
						Reference = new OpenApiReference
						{
							Type = ReferenceType.SecurityScheme,
							Id = "Bearer",
						},
						Scheme = "oauth2",
						Name = "Bearer",
						In = ParameterLocation.Header,
					},
					Array.Empty<string>()
				},
			});
	});

builder.Services.ConfigureHttpJsonOptions(options => options.SerializerOptions.Converters.Add(new JsonStringEnumConverter()));

SetupDb(builder);
SetupLogging(builder);

builder.Services.AddAuthentication(
		options =>
		{
			options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
			options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
		})
	.AddJwtBearer(
		options =>
		{
			options.TokenValidationParameters = new TokenValidationParameters
			{
				ValidateIssuer = true,
				ValidateAudience = true,
				ValidateLifetime = true,
				ValidateIssuerSigningKey = true,
				ValidIssuer = builder.Configuration["Jwt:Issuer"],
				ValidAudience = builder.Configuration["Jwt:Audience"],
				IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? string.Empty)),
			};
		});
builder.Services.AddAuthorization();

var app = builder.Build();

app.UseAuthentication();
app.UseAuthorization();

app.UseSerilogRequestLogging();

if (app.Environment.IsDevelopment())
{
	app.UseSwagger();
	app.UseSwaggerUI();
}

app.MapPost(
	"/register",
	async (
		[FromBody] RegisterRequest registration,
		[FromServices] AppDbContext dbContext,
		[FromServices] IConfiguration configuration) =>
	{
		// Validate the request
		if (!MailAddress.TryCreate(registration.Email, out var email))
		{
			return Extensions.CreateValidationProblem("404", "Invalid email address");
		}

		var emailAddress = email.Address.ToLowerInvariant();

		var usernameNormalized = registration.Username.ToUpperInvariant();

		// Check if the user already exists
		if (dbContext.Users.Any(user => user.Email == emailAddress)
			|| dbContext.Users.Any(user => user.UsernameNormalized == usernameNormalized))
		{
			return Extensions.CreateValidationProblem("409", "User already exists");
		}

		// Create the user
		var user = new User
		{
			Email = emailAddress,
			Username = registration.Username,
			UsernameNormalized = usernameNormalized,
			PasswordHash = registration.Password,
		};

		// Hash the password
		user.PasswordHash = new PasswordHasher<User>().HashPassword(user, user.PasswordHash);

		// Create access & refresh tokens
		var claims = new List<Claim>
		{
			new(ClaimTypes.Name, user.UsernameNormalized),
			new(ClaimTypes.Email, user.Email),
		};

		var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"] ?? string.Empty));
		var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
		var token = new JwtSecurityToken(
			configuration["Jwt:Issuer"],
			configuration["Jwt:Audience"],
			claims,
			expires: DateTime.Now.AddMinutes(30),
			signingCredentials: credentials);

		var accessToken = new JwtSecurityTokenHandler().WriteToken(token);

		token = new JwtSecurityToken(
			configuration["Jwt:Issuer"],
			configuration["Jwt:Audience"],
			claims,
			expires: DateTime.Now.AddMinutes(60),
			signingCredentials: credentials);

		var refreshToken = new JwtSecurityTokenHandler().WriteToken(token);

		// Add the user to the database
		dbContext.Users.Add(user);
		await dbContext.SaveChangesAsync();

		return Results.Ok(
			new
			{
				AccessToken = accessToken,
				RefreshToken = refreshToken,
			});
	});

app.MapPost(
	"/login",
	async (
		[FromBody] LoginRequest login,
		[FromServices] AppDbContext dbContext,
		[FromServices] IConfiguration configuration) =>
	{
		// Find the user
		var usernameNormalized = login.Username.ToUpperInvariant();
		var user = await dbContext.Users.FirstOrDefaultAsync(user => user.UsernameNormalized == usernameNormalized);

		if (user is null)
		{
			return Results.NotFound();
		}

		// Verify the password
		if (new PasswordHasher<User>().VerifyHashedPassword(user, user.PasswordHash, login.Password) == PasswordVerificationResult.Failed)
		{
			return Results.NotFound();
		}

		// Create access & refresh tokens
		var claims = new List<Claim>
		{
			new(ClaimTypes.Name, user.UsernameNormalized),
			new(ClaimTypes.Email, user.Email),
		};

		var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"] ?? string.Empty));
		var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
		var token = new JwtSecurityToken(
			configuration["Jwt:Issuer"],
			configuration["Jwt:Audience"],
			claims,
			expires: DateTime.Now.AddMinutes(30),
			signingCredentials: credentials);

		var accessToken = new JwtSecurityTokenHandler().WriteToken(token);

		token = new JwtSecurityToken(
			configuration["Jwt:Issuer"],
			configuration["Jwt:Audience"],
			claims,
			expires: DateTime.Now.AddMinutes(60),
			signingCredentials: credentials);

		var refreshToken = new JwtSecurityTokenHandler().WriteToken(token);

		return Results.Ok(
			new
			{
				AccessToken = accessToken,
				RefreshToken = refreshToken,
			});
	});

app.MapGet(
		"/user",
		async ([FromServices] AppDbContext dbContext, ClaimsPrincipal user) =>
		{
			var username = user.FindFirst(ClaimTypes.Name)?.Value;
			var email = user.FindFirst(ClaimTypes.Email)?.Value;

			var dbUser = await dbContext.Users.FirstOrDefaultAsync(x => x.UsernameNormalized == username);

			if (dbUser is null || !dbUser.Email.Equals(email, StringComparison.OrdinalIgnoreCase))
			{
				return Results.NotFound();
			}

			return Results.Ok(
				new
				{
					dbUser.Username,
					dbUser.Email,
				});
		})
	.RequireAuthorization();

app.MapGet("/ping", () => "pong")
	.WithTags("Health");

Log.Information("Application started");

app.Run();

return;

static void SetupLogging(WebApplicationBuilder builder)
{
	Log.Logger = new LoggerConfiguration()
		.ReadFrom.Configuration(builder.Configuration)
		.CreateLogger();

	builder.Host.UseSerilog();

	builder.Services.AddLogging(
		builder =>
		{
			builder.ClearProviders();
			builder.AddSerilog(dispose: true);
		});

	builder.Services.AddHttpLogging(
		options =>
		{
			options.LoggingFields = HttpLoggingFields.RequestMethod | HttpLoggingFields.Response;
			options.MediaTypeOptions.AddText(MediaTypeNames.Application.Json);
		});
}

static void SetupDb(WebApplicationBuilder builder)
{
	var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
	builder.Services.AddDbContext<AppDbContext>(
		optionsBuilder =>
		{
			optionsBuilder.UseSqlite(connectionString);

			if (builder.Environment.IsDevelopment())
			{
				optionsBuilder.LogTo(Log.Debug, [DbLoggerCategory.Database.Command.Name], LogLevel.Information);
				optionsBuilder.EnableSensitiveDataLogging();
			}
		});
}