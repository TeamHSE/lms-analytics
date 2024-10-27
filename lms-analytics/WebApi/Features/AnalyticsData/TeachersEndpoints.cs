using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApi.Database;
using WebApi.Features.Users;

namespace WebApi.Features.AnalyticsData;

public static class TeachersEndpoints
{
	public static void MapData(this IEndpointRouteBuilder app)
	{
		var api = app.MapGroup("teachers")
			.WithTags("Преподаватели");

		api.MapGet("data", GetDataTeachers);
		api.MapPost("add", AddTeacher);
	}

	/// <summary>
	/// Получение данных таблицы Преподаватели в виде списка
	/// </summary>
	/// <param name="dbContext">База данных</param>
	private static async Task<IResult> GetDataTeachers([FromServices] AppDbContext dbContext)
	{
		var teacher = await dbContext.Teachers.ToListAsync();

		return Results.Ok(teacher);
	}

	/// <summary>
	/// Получение данных таблицы Компаний в виде списка
	/// </summary>
	/// <param name="dbContext">База данных</param>
	/// <param name="request">Запрос с полями преподавателя</param>
	private static async Task<IResult> AddTeacher([FromServices] AppDbContext dbContext, SendTeacherRequest request)
	{
		Teacher teacherToAdd = new()
		{
			Name = request.Name,
			Surname = request.Surname,
			Lastname = request.Lastname,
			Email = request.Email,
		};

		bool isValidStudent = string.IsNullOrWhiteSpace(teacherToAdd.Name) &&
							  string.IsNullOrWhiteSpace(teacherToAdd.Surname) &&
							  string.IsNullOrWhiteSpace(teacherToAdd.Lastname) &&
							  string.IsNullOrWhiteSpace(teacherToAdd.Email);

		if (teacherToAdd == null || isValidStudent)
		{
			return Results.BadRequest("Invalid teacher data");
		}

		dbContext.Teachers.Add(teacherToAdd);
		await dbContext.SaveChangesAsync();

		return Results.Created($"/teachers/{teacherToAdd.Id}", teacherToAdd);
	}

	/// <summary>
	/// Request body
	/// </summary>
	/// <param name="Name">Имя преподавателя</param>
	/// <param name="Surname">фамилия преподавателя</param>
	/// <param name="Lastname">отчество преподавателя</param>
	/// <param name="Email">почта преподавателя</param>
	private sealed record SendTeacherRequest([MaxLength(255)] string Name, [MaxLength(255)] string Surname, [MaxLength(255)] string Lastname, [MaxLength(255)] string Email);
}