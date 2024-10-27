using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApi.Database;
using WebApi.Features.Users;

namespace WebApi.Features.AnalyticsData;

public static class StudentsEndpoints
{
	public static void MapData(this IEndpointRouteBuilder app)
	{
		var api = app.MapGroup("students")
			.WithTags("Студенты");

		api.MapGet("data", GetDataStudents);
		api.MapPost("add", AddStudent);
	}

	/// <summary>
	/// Получение данных таблицы Студенты в виде списка
	/// </summary>
	/// <param name="dbContext">База данных</param>
	private static async Task<IResult> GetDataStudents([FromServices] AppDbContext dbContext)
	{
		var students = await dbContext.Students.ToListAsync();

		return Results.Ok(students);
	}

	/// <summary>
	/// Получение данных таблицы Компаний в виде списка
	/// </summary>
	/// <param name="dbContext">База данных</param>
	/// <param name="request">Запрос с полями студента</param>
	private static async Task<IResult> AddStudent([FromServices] AppDbContext dbContext, SendStudentRequest request)
	{
		Student studentToAdd = new()
		{
			Name = request.Name,
			Surname = request.Surname,
			Lastname = request.Lastname,
			Email = request.Email,
		};

		bool isValidStudent = string.IsNullOrWhiteSpace(studentToAdd.Name) &&
							  string.IsNullOrWhiteSpace(studentToAdd.Surname) &&
							  string.IsNullOrWhiteSpace(studentToAdd.Lastname) &&
							  string.IsNullOrWhiteSpace(studentToAdd.Email);

		if (studentToAdd == null || isValidStudent)
		{
			return Results.BadRequest("Invalid student data");
		}

		dbContext.Students.Add(studentToAdd);
		await dbContext.SaveChangesAsync();

		return Results.Created($"/students/{studentToAdd.Id}", studentToAdd);
	}

	/// <summary>
	/// Request body
	/// </summary>
	/// <param name="Name">Имя студента</param>
	/// <param name="Surname">фамилия студента</param>
	/// <param name="Lastname">отчество студента</param>
	/// <param name="Email">почта студента</param>
	private sealed record SendStudentRequest([MaxLength(255)] string Name, [MaxLength(255)] string Surname, [MaxLength(255)] string Lastname, [MaxLength(255)] string Email);
}