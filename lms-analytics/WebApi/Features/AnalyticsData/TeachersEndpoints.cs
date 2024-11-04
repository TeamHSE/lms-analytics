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

		api.MapGet("/", GetDataTeachers);
		api.MapPost("/", AddTeacher);
		api.MapGet("{id:int}", GetTeacherById);
		api.MapPut("{id:int}", UpdateTeacher);
		api.MapDelete("{id:int}", DeleteTeacher);
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

		if (isValidStudent)
		{
			return Results.BadRequest("Invalid teacher data");
		}

		dbContext.Teachers.Add(teacherToAdd);
		await dbContext.SaveChangesAsync();

		return Results.Created($"/teachers/{teacherToAdd.Id}", teacherToAdd);
	}

	/// <summary>
	/// Получение данных о преподавателе через Id
	/// </summary>
	/// <param name="dbContext">База данных</param>
	/// <param name="id">Id преподавателя, чтобы получить её данные</param>
	private static async Task<IResult> GetTeacherById([FromServices] AppDbContext dbContext, [FromRoute] int id)
	{
		var teacher = await dbContext.Teachers.FindAsync(id);

		if (teacher is null)
		{
			return Results.NotFound();
		}

		return Results.Ok(teacher);
	}

	/// <summary>
	/// Обновление данных преподавателя, через Id и новые данные
	/// </summary>
	/// <param name="dbContext">База данных</param>
	/// <param name="id">Id преподавателя</param>
	/// <param name="request">Преподаватель с данными для обновления</param>
	private static async Task<IResult> UpdateTeacher([FromServices] AppDbContext dbContext, [FromRoute] int id, SendTeacherRequest request)
	{
		var teacher = await dbContext.Teachers.FindAsync(id);

		if (teacher == null)
		{
			return Results.NotFound();
		}

		dbContext.Entry(teacher).CurrentValues.SetValues(request);
		await dbContext.SaveChangesAsync();

		return Results.Ok(teacher);
	}

	/// <summary>
	/// Удаление преподавателя из БД по Id
	/// </summary>
	/// <param name="dbContext">База данных</param>
	/// <param name="id">Id преподавателя, чтобы удалить её</param>
	private static async Task<IResult> DeleteTeacher([FromServices] AppDbContext dbContext, [FromRoute] int id)
	{
		var teacher = await dbContext.Teachers.FindAsync(id);

		if (teacher == null)
		{
			return Results.NotFound();
		}

		dbContext.Remove(teacher);
		await dbContext.SaveChangesAsync();

		return Results.NoContent();
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