using WebApi.Features.Feedbacks;

namespace WebApi.Features.Users;

public interface ICanShareFeedback
{
	public List<Feedback> ReceivedFeedbacks { get; init; }

	public List<Feedback> SentFeedbacks { get; init; }
}