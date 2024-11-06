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

		api.MapGet("/", GetDataCompanies);
		api.MapPost("/", AddCompany);
		api.MapGet("{id:int}", GetCompanyById);
		api.MapPut("{id:int}", UpdateCompany);
		api.MapDelete("{id:int}", DeleteCompany);
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
	/// Добавление компании в БД
	/// </summary>
	/// <param name="dbContext">База данных</param>
	/// <param name="request">Запрос с полями компании</param>
	private static async Task<IResult> AddCompany([FromServices] AppDbContext dbContext, [FromBody] CompanyRequest request)
	{
		Company companyToAdd = new()
		{
			Companyname = request.CompanyName,
		};

		if (string.IsNullOrWhiteSpace(companyToAdd.Companyname))
		{
			return Results.BadRequest("Invalid company data");
		}

		dbContext.Companies.Add(companyToAdd);
		await dbContext.SaveChangesAsync();

		return Results.Created($"/companies/{companyToAdd.Id}", companyToAdd);
	}

	/// <summary>
	/// Получение данных о компании через Id
	/// </summary>
	/// <param name="dbContext">База данных</param>
	/// <param name="id">Id компании, чтобы получить её данные</param>
	private static async Task<IResult> GetCompanyById([FromServices] AppDbContext dbContext, [FromRoute] int id)
	{
		var company = await dbContext.Companies.FindAsync(id);

		if (company is null)
		{
			return Results.NotFound();
		}

		return Results.Ok(company);
	}

	/// <summary>
	/// Обновление данных компании, через Id и новые данные
	/// </summary>
	/// <param name="dbContext">База данных</param>
	/// <param name="id">Id Компании</param>
	/// <param name="request">Компания с данными для обновления</param>
	private static async Task<IResult> UpdateCompany([FromServices] AppDbContext dbContext, [FromRoute] int id, [FromBody] CompanyRequest request)
	{
		var company = await dbContext.Companies.FindAsync(id);

		if (company == null)
		{
			return Results.NotFound();
		}

		company.Companyname = request.CompanyName;
		await dbContext.SaveChangesAsync();

		return Results.Ok(company);
	}

	/// <summary>
	/// Удаление компании из БД по Id
	/// </summary>
	/// <param name="dbContext">База данных</param>
	/// <param name="id">Id компании, чтобы удалить её</param>
	private static async Task<IResult> DeleteCompany([FromServices] AppDbContext dbContext, [FromRoute] int id)
	{
		var company = await dbContext.Companies.FindAsync(id);

		if (company == null)
		{
			return Results.NotFound();
		}

		dbContext.Remove(company);
		await dbContext.SaveChangesAsync();

		return Results.NoContent();
	}

	/// <summary>
	/// Request body
	/// </summary>
	/// <param name="CompanyName">Название компании</param>
	private sealed record CompanyRequest([MaxLength(255)] string CompanyName);
}