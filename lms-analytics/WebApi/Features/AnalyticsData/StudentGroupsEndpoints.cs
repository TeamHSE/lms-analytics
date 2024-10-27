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

		api.MapGet("data", GetDataGroup);
		api.MapPost("add", AddGroup);
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
	/// Получение данных таблицы Компаний в виде списка
	/// </summary>
	/// <param name="dbContext">База данных</param>
	/// <param name="request">Запрос с полями учебной группы</param>
	private static async Task<IResult> AddGroup([FromServices] AppDbContext dbContext, SendGroupRequest request)
	{
		StudyGroup groupToAdd = new()
		{
			Program = request.Program,
			AdmissionYear = request.AdmissionYear,
			GroupNumber = request.GroupNumber,
		};

		bool isValidGroup = string.IsNullOrWhiteSpace(groupToAdd.Program) &&
							request is { AdmissionYear: > 1999, GroupNumber: > 0 };

		if (groupToAdd == null || isValidGroup)
		{
			return Results.BadRequest("Invalid group data");
		}

		dbContext.StudyGroups.Add(groupToAdd);
		await dbContext.SaveChangesAsync();

		return Results.Created($"/groups/{groupToAdd.Id}", groupToAdd);
	}

	/// <summary>
	/// Request body
	/// </summary>
	/// <param name="Program">Название учебной программы</param>
	/// <param name="AdmissionYear">Год набора группы на программу</param>
	/// <param name="GroupNumber">Номмер группы</param>
	private sealed record SendGroupRequest([MaxLength(255)] string Program, int AdmissionYear, int GroupNumber);
}