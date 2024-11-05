using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApi.Database;

namespace WebApi.Features.AnalyticsData;

public static class StudentGroupsEndpoints
{
	public static void MapData(this IEndpointRouteBuilder app)
	{
		var api = app.MapGroup("groups")
			.WithTags("Учебные группы");

		api.MapGet("/", GetDataGroup);
		api.MapPost("/", AddGroup);
		api.MapGet("{id:int}", GetGroupById);
		api.MapPut("{id:int}", UpdateGroup);
		api.MapDelete("{id:int}", DeleteGroup);
	}

	/// <summary>
	/// Получение данных таблицы Учебные группы в виде списка
	/// </summary>
	/// <param name="dbContext">База данных</param>
	private static async Task<IResult> GetDataGroup([FromServices] AppDbContext dbContext)
	{
		var group = await dbContext.StudyGroups.ToListAsync();

		return Results.Ok(group);
	}

	/// <summary>
	/// Получение данных таблицы Учебные группы в виде списка
	/// </summary>
	/// <param name="dbContext">База данных</param>
	/// <param name="request">Запрос с полями учебной группы</param>
	private static async Task<IResult> AddGroup([FromServices] AppDbContext dbContext, GroupRequest request)
	{
		StudyGroup groupToAdd = new()
		{
			Program = request.Program,
			AdmissionYear = request.AdmissionYear,
			GroupNumber = request.GroupNumber,
		};

		bool isValidGroup = string.IsNullOrWhiteSpace(groupToAdd.Program) &&
							request is { AdmissionYear: > 1999, GroupNumber: > 0 };

		if (isValidGroup)
		{
			return Results.BadRequest("Invalid group data");
		}

		dbContext.StudyGroups.Add(groupToAdd);
		await dbContext.SaveChangesAsync();

		return Results.Created($"/groups/{groupToAdd.Id}", groupToAdd);
	}

	/// <summary>
	/// Получение данных о учебной группе через Id
	/// </summary>
	/// <param name="dbContext">База данных</param>
	/// <param name="id">Id учебной группы, чтобы получить её данные</param>
	private static async Task<IResult> GetGroupById([FromServices] AppDbContext dbContext, [FromRoute] int id)
	{
		var group = await dbContext.StudyGroups.FindAsync(id);

		if (group is null)
		{
			return Results.NotFound();
		}

		return Results.Ok(group);
	}

	/// <summary>
	/// Обновление данных учебной группы, через Id и новые данные
	/// </summary>
	/// <param name="dbContext">База данных</param>
	/// <param name="id">Id учебной группы</param>
	/// <param name="request">Учебная группа с данными для обновления</param>
	private static async Task<IResult> UpdateGroup([FromServices] AppDbContext dbContext, [FromRoute] int id, [FromBody] GroupRequest request)
	{
		var group = await dbContext.StudyGroups.FindAsync(id);

		if (group == null)
		{
			return Results.NotFound();
		}

		group.Program = request.Program;
		group.AdmissionYear = request.AdmissionYear;
		group.GroupNumber = request.GroupNumber;
		await dbContext.SaveChangesAsync();

		return Results.Ok(group);
	}

	/// <summary>
	/// Удаление учебной группы из БД по Id
	/// </summary>
	/// <param name="dbContext">База данных</param>
	/// <param name="id">Id учебной группы, чтобы удалить её</param>
	private static async Task<IResult> DeleteGroup([FromServices] AppDbContext dbContext, [FromRoute] int id)
	{
		var group = await dbContext.StudyGroups.FindAsync(id);

		if (group == null)
		{
			return Results.NotFound();
		}

		dbContext.Remove(group);
		await dbContext.SaveChangesAsync();

		return Results.NoContent();
	}

	/// <summary>
	/// Request body
	/// </summary>
	/// <param name="Program">Название учебной программы</param>
	/// <param name="AdmissionYear">Год набора группы на программу</param>
	/// <param name="GroupNumber">Номер группы</param>
	private sealed record GroupRequest([MaxLength(255)] string Program, int AdmissionYear, int GroupNumber);
}