using System.ComponentModel.DataAnnotations;

namespace WebApi.Domain;

public class User
{
	public int Id { get; init; }

	[MaxLength(255)]
	public required string Username { get; set; } = null!;

	[MaxLength(255)]
	public required string UsernameNormalized { get; set; } = null!;

	[MaxLength(255)]
	public required string PasswordHash { get; set; } = null!;

	[EmailAddress]
	[MaxLength(255)]
	public required string Email { get; set; } = null!;
}