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

		api.MapGet("/", GetDataStudents);
		api.MapPost("/", AddStudent);
		api.MapGet("{id:int}", GetStudentById);
		api.MapPut("{id:int}", UpdateStudent);
		api.MapDelete("{id:int}", DeleteStudent);
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
	/// Получение данных таблицы Студентов в виде списка
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

		if (isValidStudent)
		{
			return Results.BadRequest("Invalid student data");
		}

		dbContext.Students.Add(studentToAdd);
		await dbContext.SaveChangesAsync();

		return Results.Created($"/students/{studentToAdd.Id}", studentToAdd);
	}

	/// <summary>
	/// Получение данных о студенте через Id
	/// </summary>
	/// <param name="dbContext">База данных</param>
	/// <param name="id">Id студента, чтобы получить её данные</param>
	private static async Task<IResult> GetStudentById([FromServices] AppDbContext dbContext, [FromRoute] int id)
	{
		var student = await dbContext.Students.FindAsync(id);

		if (student is null)
		{
			return Results.NotFound();
		}

		return Results.Ok(student);
	}

	/// <summary>
	/// Обновление данных студента, через Id и новые данные
	/// </summary>
	/// <param name="dbContext">База данных</param>
	/// <param name="id">Id студента</param>
	/// <param name="request">Студент с данными для обновления</param>
	private static async Task<IResult> UpdateStudent([FromServices] AppDbContext dbContext, [FromRoute] int id, SendStudentRequest request)
	{
		var student = await dbContext.Students.FindAsync(id);

		if (student == null)
		{
			return Results.NotFound();
		}

		dbContext.Entry(student).CurrentValues.SetValues(request);
		await dbContext.SaveChangesAsync();

		return Results.Ok(student);
	}

	/// <summary>
	/// Удаление студента из БД по Id
	/// </summary>
	/// <param name="dbContext">База данных</param>
	/// <param name="id">Id студента, чтобы удалить её</param>
	private static async Task<IResult> DeleteStudent([FromServices] AppDbContext dbContext, [FromRoute] int id)
	{
		var student = await dbContext.Students.FindAsync(id);

		if (student == null)
		{
			return Results.NotFound();
		}

		dbContext.Remove(student);
		await dbContext.SaveChangesAsync();

		return Results.NoContent();
	}

	/// <summary>
	/// Request body
	/// </summary>
	/// <param name="Name">Имя студента</param>
	/// <param name="Surname">Фамилия студента</param>
	/// <param name="Lastname">Отчество студента</param>
	/// <param name="Email">Почта студента</param>
	private sealed record SendStudentRequest([MaxLength(255)] string Name, [MaxLength(255)] string Surname, [MaxLength(255)] string Lastname, [MaxLength(255)] string Email);
}