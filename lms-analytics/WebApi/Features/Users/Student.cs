using WebApi.Features.Feedbacks;

namespace WebApi.Features.Users;

public class Student(string name, string surname, string? fatherName, string email)
	: User(name, surname, fatherName, email), ICanShareFeedback
{
	public List<Feedback> ReceivedFeedbacks { get; init; } = null!;

	public List<Feedback> SentFeedbacks { get; init; } = null!;
}