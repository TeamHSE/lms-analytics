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

		var teacherDisciplinesApi = teachersApi.MapGroup("{teacherId:int}/disciplines");
		teacherDisciplinesApi.MapPost("/", AssignDisciplineToTeacher);
		teacherDisciplinesApi.MapGet("/", GetTeacherDisciplines);
		teacherDisciplinesApi.MapDelete("{disciplineId:int}", UnassignDisciplineFromTeacher);

		var studyGroupsApi = managersApi.MapGroup("{managerId:int}/student-groups");
		studyGroupsApi.MapGet("/", GetStudyGroups);
		studyGroupsApi.MapPost("/", RegisterStudyGroup);
		studyGroupsApi.MapGet("{studyGroupId:int}", GetStudyGroup);
		studyGroupsApi.MapPut("{studyGroupId:int}", UpdateStudyGroup);
		studyGroupsApi.MapDelete("{studyGroupId:int}", DeleteStudyGroup);

		var studentsApi = managersApi.MapGroup("{managerId:int}/students");
		studentsApi.MapGet("/", GetStudents);
		studentsApi.MapPost("/", RegisterStudent);
		studentsApi.MapGet("{studentId:int}", GetStudent);
		studentsApi.MapPut("{studentId:int}", UpdateStudent);
		studentsApi.MapDelete("{studentId:int}", DeleteStudent);
		studentsApi.MapPost("{studentId:int}/student-groups/{studyGroupId:int}", AssignStudentToGroup);

		var studentDisciplinesApi = studentsApi.MapGroup("{studentId:int}/disciplines");
		studentDisciplinesApi.MapPost("/", AssignDisciplineToStudent);
		studentDisciplinesApi.MapGet("/", GetStudentDisciplines);
		studentDisciplinesApi.MapDelete("{disciplineId:int}", UnassignDisciplineFromStudent);
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

	private static async Task<IResult> GetStudyGroups(
		[FromServices] AppDbContext dbContext,
		[FromRoute] int companyId,
		[FromRoute] int managerId)
	{
		var studyGroups = await dbContext.StudyGroups
			.Where(x => x.CompanyId == companyId)
			.ToListAsync();

		return Results.Ok(studyGroups.Select(x => new StudyGroupResponse(x.Id, x.Program, x.GroupNumber, x.AdmissionYear)));
	}

	private static async Task<IResult> RegisterStudyGroup(
		[FromServices] AppDbContext dbContext,
		[FromRoute] int companyId,
		[FromRoute] int managerId,
		[FromBody] RegisterStudyGroupRequest request)
	{
		var manager = await dbContext.Managers
			.Include(x => x.Company)
			.SingleOrDefaultAsync(x => x.Id == managerId && x.CompanyId == companyId);
		if (manager is null)
		{
			return Results.NotFound();
		}

		var group = manager.RegisterStudyGroup(request.Program, request.GroupNumber, request.AdmissionYear);
		await dbContext.SaveChangesAsync();

		return Results.Created(
			$"student-groups/{group.Id}",
			new StudyGroupResponse(group.Id, group.Program, group.GroupNumber, group.AdmissionYear));
	}

	private static async Task<IResult> GetStudyGroup(
		[FromServices] AppDbContext dbContext,
		[FromRoute] int companyId,
		[FromRoute] int managerId,
		[FromRoute] int studyGroupId)
	{
		var studyGroup = await dbContext.StudyGroups.FindAsync(studyGroupId);
		if (studyGroup == null || studyGroup.CompanyId != companyId)
		{
			return Results.NotFound("Группа студентов не найдена");
		}

		return Results.Ok(new StudyGroupResponse(studyGroup.Id, studyGroup.Program, studyGroup.GroupNumber, studyGroup.AdmissionYear));
	}

	private static async Task<IResult> UpdateStudyGroup(
		[FromServices] AppDbContext dbContext,
		[FromRoute] int companyId,
		[FromRoute] int managerId,
		[FromRoute] int studyGroupId,
		[FromBody] UpdateStudyGroupRequest request)
	{
		var studyGroup = await dbContext.StudyGroups.FindAsync(studyGroupId);
		if (studyGroup == null || studyGroup.CompanyId != companyId)
		{
			return Results.NotFound("Группа студентов не найдена");
		}

		studyGroup.Program = request.Program ?? studyGroup.Program;
		studyGroup.GroupNumber = request.GroupNumber ?? studyGroup.GroupNumber;
		studyGroup.AdmissionYear = request.AdmissionYear ?? studyGroup.AdmissionYear;
		await dbContext.SaveChangesAsync();

		return Results.Ok(new StudyGroupResponse(studyGroup.Id, studyGroup.Program, studyGroup.GroupNumber, studyGroup.AdmissionYear));
	}

	private static async Task<IResult> DeleteStudyGroup(
		[FromServices] AppDbContext dbContext,
		[FromRoute] int companyId,
		[FromRoute] int managerId,
		[FromRoute] int studyGroupId)
	{
		var studyGroup = await dbContext.StudyGroups.FindAsync(studyGroupId);
		if (studyGroup == null || studyGroup.CompanyId != companyId)
		{
			return Results.NotFound("Группа студентов не найдена");
		}

		dbContext.StudyGroups.Remove(studyGroup);
		await dbContext.SaveChangesAsync();

		return Results.NoContent();
	}

	private static async Task<IResult> GetStudents(
		[FromServices] AppDbContext dbContext,
		[FromRoute] int companyId,
		[FromRoute] int managerId)
	{
		var students = await dbContext.Students.Where(x => x.CompanyId == companyId).ToListAsync();

		return Results.Ok(students.Select(x => new StudentResponse(x.Id, x.Name, x.Surname, x.FatherName, x.Email, x.StudyGroupId)));
	}

	private static async Task<IResult> RegisterStudent(
		[FromServices] AppDbContext dbContext,
		[FromRoute] int companyId,
		[FromRoute] int managerId,
		[FromBody] RegisterStudentRequest request)
	{
		var manager = await dbContext.Managers
			.Include(x => x.Company)
			.Include(x => x.StudyGroups)
			.ThenInclude(x => x.Students)
			.SingleOrDefaultAsync(x => x.Id == managerId && x.CompanyId == companyId);
		if (manager is null)
		{
			return Results.NotFound();
		}

		var isValidStudent = string.IsNullOrWhiteSpace(request.Name) ||
							 string.IsNullOrWhiteSpace(request.Surname) ||
							 string.IsNullOrWhiteSpace(request.Email);
		if (isValidStudent)
		{
			return Results.BadRequest("Некорректные данные студента");
		}

		var student = manager.RegisterStudent(request.Name, request.Surname, request.FatherName, request.Email, request.StudyGroupId);
		await dbContext.SaveChangesAsync();

		return Results.Created(
			$"students/{student.Id}",
			new StudentResponse(student.Id, student.Name, student.Surname, student.FatherName, student.Email, student.StudyGroupId));
	}

	private static async Task<IResult> GetStudent(
		[FromServices] AppDbContext dbContext,
		[FromRoute] int companyId,
		[FromRoute] int managerId,
		[FromRoute] int studentId)
	{
		var student = await dbContext.Students.FindAsync(studentId);
		if (student == null || student.CompanyId != companyId)
		{
			return Results.NotFound();
		}

		return Results.Ok(new StudentResponse(student.Id, student.Name, student.Surname, student.FatherName, student.Email, student.StudyGroupId));
	}

	private static async Task<IResult> UpdateStudent(
		[FromServices] AppDbContext dbContext,
		[FromRoute] int companyId,
		[FromRoute] int managerId,
		[FromRoute] int studentId,
		[FromBody] UpdateStudentRequest request)
	{
		var student = await dbContext.Students.FindAsync(studentId);
		if (student == null || student.CompanyId != companyId)
		{
			return Results.NotFound();
		}

		student.Name = request.Name ?? student.Name;
		student.Surname = request.Surname ?? student.Surname;
		student.Email = request.Email ?? student.Email;

		await dbContext.SaveChangesAsync();

		return Results.Ok(new StudentResponse(student.Id, student.Name, student.Surname, student.FatherName, student.Email, student.StudyGroupId));
	}

	private static async Task<IResult> DeleteStudent(
		[FromServices] AppDbContext dbContext,
		[FromRoute] int companyId,
		[FromRoute] int managerId,
		[FromRoute] int studentId)
	{
		var manager = await dbContext.Managers
			.Include(x => x.StudyGroups)
			.ThenInclude(x => x.Students)
			.SingleOrDefaultAsync(x => x.Id == managerId);
		if (manager is null)
		{
			return Results.NotFound();
		}

		manager.DeleteStudent(studentId);
		await dbContext.SaveChangesAsync();

		return Results.NoContent();
	}

	private static async Task<IResult> AssignStudentToGroup(
		[FromServices] AppDbContext dbContext,
		[FromRoute] int companyId,
		[FromRoute] int managerId,
		[FromRoute] int studentId,
		[FromRoute] int studyGroupId)
	{
		var manager = await dbContext.Managers
			.Include(x => x.StudyGroups)
			.ThenInclude(x => x.Students)
			.SingleOrDefaultAsync(x => x.Id == managerId);
		if (manager is null)
		{
			return Results.NotFound();
		}

		var student = manager.AssignStudentToGroup(studentId, studyGroupId);
		await dbContext.SaveChangesAsync();

		return Results.Ok(new StudentResponse(student.Id, student.Name, student.Surname, student.FatherName, student.Email, student.StudyGroupId));
	}

	private static async Task<IResult> AssignDisciplineToStudent(
		[FromServices] AppDbContext dbContext,
		[FromRoute] int companyId,
		[FromRoute] int managerId,
		[FromRoute] int studentId,
		[FromBody] AssignDisciplineRequest request)
	{
		var manager = await dbContext.Managers
			.Include(x => x.StudyGroups)
			.ThenInclude(x => x.Students)
			.ThenInclude(x => x.Disciplines)
			.SingleOrDefaultAsync(x => x.Id == managerId);
		if (manager is null)
		{
			return Results.NotFound();
		}

		var studentDisciplines = manager.AssignDisciplineToStudent(studentId, request.DisciplineId);
		await dbContext.SaveChangesAsync();

		return Results.Ok(
			new
			{
				studentId,
				disciplines = studentDisciplines.Select(x => new DisciplineResponse(x.Id, x.Name, x.CompanyId)),
			});
	}

	private static async Task<IResult> GetStudentDisciplines(
		[FromServices] AppDbContext dbContext,
		[FromRoute] int companyId,
		[FromRoute] int managerId,
		[FromRoute] int studentId)
	{
		var student = await dbContext.Students
			.Include(x => x.Disciplines)
			.SingleOrDefaultAsync(x => x.Id == studentId);
		if (student is null || student.CompanyId != companyId)
		{
			return Results.NotFound();
		}

		return Results.Ok(student.Disciplines.Select(x => new DisciplineResponse(x.Id, x.Name, x.CompanyId)));
	}

	private static async Task<IResult> UnassignDisciplineFromStudent(
		[FromServices] AppDbContext dbContext,
		[FromRoute] int companyId,
		[FromRoute] int managerId,
		[FromRoute] int studentId,
		[FromRoute] int disciplineId)
	{
		var manager = await dbContext.Managers
			.Include(x => x.StudyGroups)
			.ThenInclude(x => x.Students)
			.ThenInclude(x => x.Disciplines)
			.SingleOrDefaultAsync(x => x.Id == managerId);
		if (manager is null)
		{
			return Results.NotFound();
		}

		var studentDisciplines = manager.UnassignDisciplineFromStudent(studentId, disciplineId);
		await dbContext.SaveChangesAsync();

		return Results.Ok(
			new
			{
				studentId,
				disciplines = studentDisciplines.Select(x => new DisciplineResponse(x.Id, x.Name, x.CompanyId)),
			});
	}

	private sealed record RegisterStudyGroupRequest(string Program, string GroupNumber, int AdmissionYear);

	private sealed record StudyGroupResponse(int Id, string Program, string GroupNumber, int AdmissionYear);

	private sealed record RegisterStudentRequest([MaxLength(255)] string Name, [MaxLength(255)] string Surname, [MaxLength(255)] string? FatherName, [EmailAddress] string Email, int StudyGroupId);

	private sealed record StudentResponse(int Id, string Name, string Surname, string? FatherName, string Email, int StudyGroupId);

	private sealed record UpdateStudyGroupRequest([MaxLength(255)] string? Program, string? GroupNumber, int? AdmissionYear);

	private sealed record UpdateStudentRequest([MaxLength(255)] string? Name, [MaxLength(255)] string? Surname, [EmailAddress] string? Email);

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