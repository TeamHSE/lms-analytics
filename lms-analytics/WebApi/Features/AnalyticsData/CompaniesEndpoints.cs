using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApi.Database;

namespace WebApi.Features.AnalyticsData;

public static class CompaniesEndpoints
{
	public static void MapData(this IEndpointRouteBuilder app)
	{
		var api = app.MapGroup("companies")
			.WithTags("Компании");

		api.MapGet("data", GetDataCompanies);
		api.MapPost("add", AddCompany);
		api.MapPost("get", GetCompanyById);
		api.MapPut("update", UpdateCompany);
		api.MapDelete("delete", DeleteCompany);
	}

	/// <summary>
	/// Получение данных таблицы Компаний в виде списка
	/// </summary>
	/// <param name="dbContext">База данных</param>
	private static async Task<IResult> GetDataCompanies([FromServices] AppDbContext dbContext)
	{
		var companies = await dbContext.Companies.ToListAsync();

		return Results.Ok(companies);
	}

	/// <summary>
	/// Получение данных таблицы Компаний в виде списка
	/// </summary>
	/// <param name="dbContext">База данных</param>
	/// <param name="request">Запрос с полями компании</param>
	private static async Task<IResult> AddCompany([FromServices] AppDbContext dbContext, SendCompanyRequest request)
	{
		Company companyToAdd = new()
		{
			Companyname = request.CompanyName,
		};

		if (companyToAdd == null || string.IsNullOrWhiteSpace(companyToAdd.Companyname))
		{
			return Results.BadRequest("Invalid company data");
		}

		dbContext.Companies.Add(companyToAdd);
		await dbContext.SaveChangesAsync();

		return Results.Created($"/companies/{companyToAdd.Id}", companyToAdd);
	}

	private static async Task<IResult> GetCompanyById([FromServices] AppDbContext dbContext, [FromRoute] int id)
	{
		var company = await dbContext.Companies.FindAsync(id);

		if (company is null)
		{
			return Results.NotFound();
		}

		return Results.Ok(company);
	}

	private static async Task<IResult> UpdateCompany([FromServices] AppDbContext dbContext, [FromBody] Company companyUpdate)
	{
		var company = await dbContext.Companies.FindAsync(companyUpdate.Id);

		if (company == null)
		{
			return Results.NotFound();
		}

		dbContext.Entry(company).CurrentValues.SetValues(companyUpdate);
		await dbContext.SaveChangesAsync();

		return Results.Ok(company);
	}

	private static async Task<IResult> DeleteCompany([FromServices] AppDbContext dbContext, [FromRoute] int id)
	{
		var company = await dbContext.Companies.FindAsync(id);

		if (company == null)
		{
			return Results.NotFound();
		}

		dbContext.Remove(company);
		await dbContext.SaveChangesAsync();

		return Results.Ok(company);
	}

	private static async Task<IResult> CreateCompany([FromServices] AppDbContext dbContext, [FromBody] Company company)
	{
		dbContext.Companies.Add(company);
		await dbContext.SaveChangesAsync();

		return Results.Ok(company);
	}

	/// <summary>
	/// Request body
	/// </summary>
	/// <param name="CompanyName">Название компании</param>
	private sealed record SendCompanyRequest([MaxLength(255)] string CompanyName);
}