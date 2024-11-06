using System.Diagnostics.CodeAnalysis;
using WebApi.Features.Users;

namespace WebApi.Features.Managers;

public class Manager : User
{
	internal Manager(string name, string surname, string? fatherName, string email, int companyId)
		: base(name, surname, fatherName, email)
	{
		CompanyId = companyId;
	}

	public int CompanyId { get; private init; }

	public Company Company { get; private init; } = null!;

	public List<Discipline> Disciplines { get; private init; } = [];

	public List<Teacher> Teachers { get; private init; } = [];

	public Discipline AddDiscipline(string name)
	{
		var discipline = new Discipline(name, Company.Id);
		Disciplines.Add(discipline);
		return discipline;
	}

	public Teacher RegisterTeacher(string name, string surname, string fatherName, string email, int companyId)
	{
		var teacher = new Teacher(name, surname, fatherName, email, companyId);
		Teachers.Add(teacher);
		return teacher;
	}
}