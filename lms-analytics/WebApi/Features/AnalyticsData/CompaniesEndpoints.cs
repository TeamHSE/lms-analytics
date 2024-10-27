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

	/// <summary>
	/// Request body
	/// </summary>
	/// <param name="CompanyName">Название компании</param>
	private sealed record SendCompanyRequest([MaxLength(255)] string CompanyName);
}