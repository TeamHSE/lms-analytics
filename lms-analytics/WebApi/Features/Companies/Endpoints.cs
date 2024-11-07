using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApi.Database;

namespace WebApi.Features.Companies;

public static class Endpoints
{
	public static void MapCompanies(this IEndpointRouteBuilder app)
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

		return Results.Ok(companies.Select(c => new CompanyResponse(c.Id, c.Name)));
	}

	/// <summary>
	/// Добавление компании в БД
	/// </summary>
	/// <param name="dbContext">База данных</param>
	/// <param name="request">Запрос с полями компании</param>
	private static async Task<IResult> AddCompany([FromServices] AppDbContext dbContext, [FromBody] CompanyRequest request)
	{
		if (string.IsNullOrWhiteSpace(request.CompanyName))
		{
			return Results.BadRequest("Не указано название компании");
		}

		var admin = await dbContext.Admins
			.Where(a => a.Id == request.AdminId)
			.Include(a => a.Companies)
			.SingleOrDefaultAsync();
		if (admin is null)
		{
			return Results.NotFound();
		}

		var company = admin.RegisterCompany(request.CompanyName);
		await dbContext.SaveChangesAsync();

		return Results.Created($"/companies/{company.Id}", new CompanyResponse(company.Id, company.Name));
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

		return Results.Ok(new CompanyResponse(company.Id, company.Name));
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

		company.Name = request.CompanyName;
		await dbContext.SaveChangesAsync();

		return Results.Ok(new CompanyResponse(company.Id, company.Name));
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
	/// <param name="AdminId">ID администратора</param>
	private sealed record CompanyRequest(int AdminId, [MaxLength(255)] string CompanyName);

	private sealed record CompanyResponse(int Id, string Name);
}