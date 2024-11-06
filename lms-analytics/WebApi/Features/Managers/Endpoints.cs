using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApi.Database;

namespace WebApi.Features.Managers;

public static class Endpoints
{
	public static void MapManagers(this IEndpointRouteBuilder app)
	{
		var managersApi = app.MapGroup("{companyId:int}/managers")
			.WithTags("Менеджеры");

		managersApi.MapGet("/", GetManagers);
		managersApi.MapGet("/{managerId:int}", GetManager);
		managersApi.MapGet("/disciplines", GetAllDisciplines);
		managersApi.MapPost("/", RegisterManager);
		managersApi.MapPost("/{managerId:int}/disciplines", AddDiscipline);

		var teachersApi = managersApi.MapGroup("{managerId:int}/teachers");
		teachersApi.MapGet("/", GetTeachers);
		teachersApi.MapPost("/", RegisterTeacher);
		teachersApi.MapGet("{teacherId:int}", GetTeacher);
		teachersApi.MapPut("{teacherId:int}", UpdateTeacher);
		teachersApi.MapDelete("{teacherId:int}", DeleteTeacher);

		var disciplinesApi = teachersApi.MapGroup("{teacherId:int}/disciplines");
		disciplinesApi.MapPost("/", AssignDisciplineToTeacher);
		disciplinesApi.MapGet("/", GetTeacherDisciplines);
		disciplinesApi.MapDelete("{disciplineId:int}", UnassignDisciplineFromTeacher);
	}

	private static async Task<IResult> AddDiscipline(
		[FromServices] AppDbContext dbContext,
		[FromRoute] int companyId,
		[FromRoute] int managerId,
		[FromBody] AddDisciplineRequest request)
	{
		var manager = await dbContext.Managers
			.Include(x => x.Company)
			.SingleOrDefaultAsync(x => x.Id == managerId);
		if (manager is null)
		{
			return Results.NotFound("Менеджер не найден");
		}

		var discipline = manager.AddDiscipline(request.Name);
		await dbContext.SaveChangesAsync();

		return Results.Created(
			$"disciplines/{discipline.Id}",
			new DisciplineResponse(discipline.Id, discipline.Name, discipline.CompanyId));
	}

	private static async Task<IResult> GetAllDisciplines([FromServices] AppDbContext dbContext, [FromRoute] int companyId)
	{
		var disciplines = await dbContext.Disciplines
			.Where(x => x.CompanyId == companyId)
			.ToListAsync();
		return Results.Ok(disciplines.Select(x => new DisciplineResponse(x.Id, x.Name, x.CompanyId)));
	}

	private static async Task<IResult> GetManagers([FromServices] AppDbContext dbContext, [FromRoute] int companyId)
	{
		var managers = await dbContext.Managers
			.Where(x => x.CompanyId == companyId)
			.ToListAsync();
		return Results.Ok(managers.Select(x => new ManagerResponse(x.Id, x.Name, x.Surname, x.FatherName, x.Email, x.CompanyId)));
	}

	private static async Task<IResult> GetManager([FromServices] AppDbContext dbContext, [FromRoute] int companyId, [FromRoute] int managerId)
	{
		var manager = await dbContext.Managers.SingleOrDefaultAsync(x => x.Id == managerId);

		return manager is null
			? Results.NotFound("Менеджер не найден")
			: Results.Ok(new ManagerResponse(manager.Id, manager.Name, manager.Surname, manager.FatherName, manager.Email, manager.CompanyId));
	}

	private static async Task<IResult> RegisterManager(
		HttpContext context,
		[FromServices] AppDbContext dbContext,
		[FromRoute] int companyId,
		[FromBody] RegisterManagerRequest request)
	{
		var company = await dbContext.Companies.SingleOrDefaultAsync(x => x.Id == companyId);
		if (company is null)
		{
			return Results.NotFound("Компания не найдена");
		}

		var admin = await dbContext.Admins.Where(x => x.Id == request.AdminId)
			.Include(a => a.Managers)
			.SingleOrDefaultAsync();
		if (admin is null)
		{
			return Results.NotFound();
		}

		var manager = admin.RegisterManager(request.Name, request.Surname, request.FatherName, request.Email, companyId);
		await dbContext.SaveChangesAsync();

		return Results.Created(
			$"managers/{manager.Id}",
			new ManagerResponse(manager.Id, manager.Name, manager.Surname, manager.FatherName, manager.Email, manager.CompanyId));
	}

	private static async Task<IResult> GetTeachers(
		[FromServices] AppDbContext dbContext,
		[FromRoute] int companyId,
		[FromRoute] int managerId)
	{
		var teachers = await dbContext.Teachers.Where(x => x.CompanyId == companyId).ToListAsync();

		return Results.Ok(teachers.Select(x => new TeacherResponse(x.Id, x.Name, x.Surname, x.FatherName, x.Email, x.CompanyId)));
	}

	private static async Task<IResult> RegisterTeacher(
		[FromServices] AppDbContext dbContext,
		[FromRoute] int companyId,
		[FromRoute] int managerId,
		[FromBody] RegisterTeacherRequest request)
	{
		var manager = await dbContext.Managers
			.Include(x => x.Company)
			.SingleOrDefaultAsync(x => x.Id == managerId);
		if (manager is null)
		{
			return Results.NotFound();
		}

		var isValidTeacher = !string.IsNullOrWhiteSpace(request.Name) &&
							 !string.IsNullOrWhiteSpace(request.Surname) &&
							 !string.IsNullOrWhiteSpace(request.Email);

		if (!isValidTeacher)
		{
			return Results.BadRequest("Invalid teacher data");
		}

		var teacher = manager.RegisterTeacher(request.Name, request.Surname, request.FatherName, request.Email, companyId);

		dbContext.Teachers.Add(teacher);
		await dbContext.SaveChangesAsync();

		return Results.Created(
			$"{managerId}/teachers/{teacher.Id}",
			new TeacherResponse(teacher.Id, teacher.Name, teacher.Surname, teacher.FatherName, teacher.Email, teacher.CompanyId));
	}

	private static async Task<IResult> GetTeacher(
		[FromServices] AppDbContext dbContext,
		[FromRoute] int companyId,
		[FromRoute] int managerId,
		[FromRoute] int teacherId)
	{
		var teacher = await dbContext.Teachers.FindAsync(teacherId);

		if (teacher is null || teacher.CompanyId != companyId)
		{
			return Results.NotFound();
		}

		return Results.Ok(new TeacherResponse(teacher.Id, teacher.Name, teacher.Surname, teacher.FatherName, teacher.Email, teacher.CompanyId));
	}

	private static async Task<IResult> UpdateTeacher(
		[FromServices] AppDbContext dbContext,
		[FromRoute] int companyId,
		[FromRoute] int managerId,
		[FromRoute] int teacherId,
		[FromBody] UpdateTeacherRequest request)
	{
		var teacher = await dbContext.Teachers.FindAsync(teacherId);
		if (teacher == null || teacher.CompanyId != companyId)
		{
			return Results.NotFound();
		}

		teacher.Name = request.Name ?? teacher.Name;
		teacher.Surname = request.Surname ?? teacher.Surname;
		teacher.FatherName = request.FatherName ?? teacher.FatherName;
		teacher.Email = request.Email ?? teacher.Email;

		await dbContext.SaveChangesAsync();

		return Results.Ok(new TeacherResponse(teacher.Id, teacher.Name, teacher.Surname, teacher.FatherName, teacher.Email, teacher.CompanyId));
	}

	private static async Task<IResult> DeleteTeacher(
		[FromServices] AppDbContext dbContext,
		[FromRoute] int companyId,
		[FromRoute] int managerId,
		[FromRoute] int teacherId)
	{
		var teacher = await dbContext.Teachers.FindAsync(teacherId);

		if (teacher == null || teacher.CompanyId != companyId)
		{
			return Results.NotFound();
		}

		dbContext.Remove(teacher);
		await dbContext.SaveChangesAsync();

		return Results.NoContent();
	}

	private static async Task<IResult> AssignDisciplineToTeacher(
		[FromServices] AppDbContext dbContext,
		[FromRoute] int companyId,
		[FromRoute] int managerId,
		[FromRoute] int teacherId,
		[FromBody] AssignDisciplineRequest request)
	{
		var teacher = await dbContext.Teachers.FindAsync(teacherId);
		if (teacher == null || teacher.CompanyId != companyId)
		{
			return Results.NotFound();
		}

		var discipline = await dbContext.Disciplines.SingleOrDefaultAsync(
			x => x.CompanyId == companyId && x.Id == request.DisciplineId);
		if (discipline == null || discipline.CompanyId != companyId)
		{
			return Results.NotFound();
		}

		teacher.AssignDiscipline(discipline);
		await dbContext.SaveChangesAsync();

		return Results.NoContent();
	}

	private static async Task<IResult> GetTeacherDisciplines(
		[FromServices] AppDbContext dbContext,
		[FromRoute] int companyId,
		[FromRoute] int managerId,
		[FromRoute] int teacherId)
	{
		var teacher = await dbContext.Teachers
			.Include(x => x.Disciplines)
			.SingleOrDefaultAsync(x => x.Id == teacherId);
		if (teacher is null || teacher.CompanyId != companyId)
		{
			return Results.NotFound();
		}

		return Results.Ok(teacher.Disciplines.Select(x => new DisciplineResponse(x.Id, x.Name, x.CompanyId)));
	}

	private static async Task<IResult> UnassignDisciplineFromTeacher(
		[FromServices] AppDbContext dbContext,
		[FromRoute] int companyId,
		[FromRoute] int managerId,
		[FromRoute] int teacherId,
		[FromRoute] int disciplineId)
	{
		var teacher = await dbContext.Teachers
			.Include(x => x.Disciplines)
			.SingleOrDefaultAsync(x => x.Id == teacherId);
		if (teacher is null || teacher.CompanyId != companyId)
		{
			return Results.NotFound();
		}

		var discipline = teacher.Disciplines.SingleOrDefault(x => x.Id == disciplineId);
		if (discipline is null || discipline.CompanyId != companyId)
		{
			return Results.NotFound();
		}

		teacher.Unassign(discipline);
		await dbContext.SaveChangesAsync();

		return Results.NoContent();
	}

	private sealed record AddDisciplineRequest([MaxLength(300)] string Name);

	private sealed record RegisterManagerRequest(
		int AdminId,
		[MaxLength(255)] string Name,
		[MaxLength(255)] string Surname,
		[MaxLength(255)] string? FatherName,
		[MaxLength(255)] string Email);

	private sealed record ManagerResponse(int Id, string Name, string Surname, string? FatherName, string Email, int CompanyId);

	private sealed record DisciplineResponse(int Id, string Name, int CompanyId);

	private sealed record TeacherResponse(int Id, string Name, string Surname, string? FatherName, string Email, int CompanyId);

	private sealed record RegisterTeacherRequest([MaxLength(255)] string Name, [MaxLength(255)] string Surname, [MaxLength(255)] string FatherName, [MaxLength(255)] [EmailAddress] string Email);

	private sealed record UpdateTeacherRequest([MaxLength(255)] string? Name, [MaxLength(255)] string? Surname, [MaxLength(255)] string? FatherName, [MaxLength(255)] [EmailAddress] string? Email);

	private sealed record AssignDisciplineRequest(int DisciplineId);
}