using WebApi.Features.Companies;
using WebApi.Features.Feedbacks;
using WebApi.Features.Managers;

namespace WebApi.Features.Users;

public class Student(string name, string surname, string? fatherName, string email, int studyGroupId, int companyId)
	: User(name, surname, fatherName, email), ICanShareFeedback
{
	public int StudyGroupId { get; internal set; } = studyGroupId;

	public StudyGroup StudyGroup { get; private set; } = null!;

	public int CompanyId { get; private init; } = companyId;

	public Company Company { get; private init; } = null!;

	public List<Discipline> Disciplines { get; private init; } = [];

	public List<Feedback> ReceivedFeedbacks { get; init; } = null!;

	public List<Feedback> SentFeedbacks { get; init; } = null!;

	public void AssignDiscipline(Discipline discipline)
	{
		Disciplines.Add(discipline);
	}

	public void Unassign(Discipline discipline)
	{
		Disciplines.Remove(discipline);
	}
}