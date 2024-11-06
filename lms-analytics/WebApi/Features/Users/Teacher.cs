using WebApi.Features.Feedbacks;
using WebApi.Features.Managers;

namespace WebApi.Features.Users;

public class Teacher : User, ICanShareFeedback
{
	public Teacher(string name, string surname, string? fatherName, string email, int companyId)
		: base(name, surname, fatherName, email)
	{
		CompanyId = companyId;
	}

	public int CompanyId { get; private init; }

	public Company Company { get; private init; } = null!;

	public List<Discipline> Disciplines { get; init; } = [];

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