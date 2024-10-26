using System.ComponentModel.DataAnnotations;

namespace WebApi.Features.Feedbacks;

public class Feedback
{
	public int Id { get; init; }

	public required int SenderId { get; init; }

	public required int ReceiverId { get; init; }

	[MaxLength(1000)]
	public required string Text { get; init; } = null!;

	public required DateTimeOffset CreatedAt { get; init; }

	public required FeedbackPersonType SenderType { get; init; }

	public required FeedbackPersonType ReceiverType { get; init; }
}