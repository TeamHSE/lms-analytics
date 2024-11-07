using System.Diagnostics.CodeAnalysis;
using WebApi.Features.Companies;
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

	public List<StudyGroup> StudyGroups { get; private init; } = [];

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

	public StudyGroup RegisterStudyGroup(string program, string groupNumber, int admissionYear)
	{
		var group = new StudyGroup(program, groupNumber, admissionYear, Company.Id);
		StudyGroups.Add(group);
		return group;
	}

	public Student RegisterStudent(string name, string surname, string? fatherName, string email, int studyGroupId)
	{
		var group = StudyGroups.Single(g => g.Id == studyGroupId);
		var student = new Student(name, surname, fatherName, email, studyGroupId);
		group.Students.Add(student);
		return student;
	}

	public void DeleteStudent(int studentId)
	{
		var student = StudyGroups.SelectMany(g => g.Students).Single(s => s.Id == studentId);
		student.StudyGroup.Students.Remove(student);
	}

	public Student AssignStudentToGroup(int studentId, int studyGroupId)
	{
		var student = StudyGroups.SelectMany(g => g.Students).Single(s => s.Id == studentId);
		var group = StudyGroups.Single(g => g.Id == studyGroupId);
		student.StudyGroupId = studyGroupId;
		group.Students.Add(student);
		return student;
	}

	public Discipline[] AssignDisciplineToStudent(int studentId, int disciplineId)
	{
		var student = StudyGroups.SelectMany(g => g.Students).Single(s => s.Id == studentId);
		var discipline = Disciplines.Single(d => d.Id == disciplineId);
		student.Disciplines.Add(discipline);
		return student.Disciplines.ToArray();
	}

	public Discipline[] UnassignDisciplineFromStudent(int studentId, int disciplineId)
	{
		var student = StudyGroups.SelectMany(g => g.Students).Single(s => s.Id == studentId);
		var discipline = Disciplines.Single(d => d.Id == disciplineId);
		student.Disciplines.Remove(discipline);
		return student.Disciplines.ToArray();
	}
}