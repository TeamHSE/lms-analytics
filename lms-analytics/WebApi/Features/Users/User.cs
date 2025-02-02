using System.ComponentModel.DataAnnotations;

namespace WebApi.Features.Users;

public abstract class User
{
	public int Id { get; init; }

	[MaxLength(255)]
	public required string Name { get; set; } = null!;

	[MaxLength(255)]
	public required string Surname { get; set; } = null!;

	[MaxLength(255)]
	public required string Lastname { get; set; } = null!;

	[EmailAddress]
	[MaxLength(255)]
	public required string Email { get; set; } = null!;
}