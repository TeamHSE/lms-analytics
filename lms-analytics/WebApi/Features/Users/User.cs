using System.ComponentModel.DataAnnotations;

namespace WebApi.Features.Users;

public abstract class User
{
	protected User(string name, string surname, string? fatherName, string email)
	{
		Name = name;
		Surname = surname;
		FatherName = fatherName;
		Email = email;
	}

	public int Id { get; init; }

	[MaxLength(255)]
	public string Name { get; set; }

	[MaxLength(255)]
	public string Surname { get; set; }

	[MaxLength(255)]
	public string? FatherName { get; set; }

	[EmailAddress]
	[MaxLength(255)]
	public string Email { get; set; }
}