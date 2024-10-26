using System.ComponentModel.DataAnnotations;

namespace WebApi.Domain.Users;

public class Teacher : User, ICanShareFeedback
{
	public List<Feedback> ReceivedFeedbacks { get; init; } = null!;

	public List<Feedback> SentFeedbacks { get; init; } = null!;
}