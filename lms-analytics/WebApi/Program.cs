using System.Net.Mime;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.HttpLogging;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Serilog;
using WebApi.Database;
using WebApi.Features.AnalyticsData;
using WebApi.Features.Feedbacks;
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options => options.SwaggerDoc("v1", new OpenApiInfo { Title = "WebApi", Version = "v1" }));

builder.Services.ConfigureHttpJsonOptions(options => options.SerializerOptions.Converters.Add(new JsonStringEnumConverter()));

SetupDb(builder);
SetupLogging(builder);

const string corsPolicyName = "uiPolicy";

builder.Services.AddCors(
	options => options.AddPolicy(
		name: corsPolicyName,
		policyBuilder => policyBuilder
			.WithOrigins("http://localhost:3000")
			.AllowCredentials()
			.AllowAnyMethod()
			.AllowAnyHeader()));

var app = builder.Build();

app.UseCors(corsPolicyName);

app.UseSerilogRequestLogging();

if (app.Environment.IsDevelopment())
{
	app.UseSwagger();
	app.UseSwaggerUI();
}

app.MapGet("/ping", () => "pong")
	.WithTags("Health");

Endpoints.MapFeedbacks(app);
CompaniesEndpoints.MapData(app);
StudentsEndpoints.MapData(app);
StudentGroupsEndpoints.MapData(app);
TeachersEndpoints.MapData(app);

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