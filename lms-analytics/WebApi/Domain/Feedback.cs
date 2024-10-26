using System.ComponentModel.DataAnnotations;

namespace WebApi.Domain;

public class Feedback
{
	public int Id { get; init; }

	public required int SenderId { get; init; }

	public required int ReceiverId { get; init; }

	[MaxLength(1000)]
	public required string Text { get; init; } = null!;

	public required DateTimeOffset CreatedAt { get; init; }

	public User Sender { get; init; } = null!;

	public User Receiver { get; init; } = null!;
}