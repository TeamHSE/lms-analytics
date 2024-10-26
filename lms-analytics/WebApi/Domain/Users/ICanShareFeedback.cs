namespace WebApi.Domain.Users;

public interface ICanShareFeedback
{
	public List<Feedback> ReceivedFeedbacks { get; init; }

	public List<Feedback> SentFeedbacks { get; init; }
}