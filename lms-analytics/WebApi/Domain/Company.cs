using System.ComponentModel.DataAnnotations;

namespace WebApi.Domain;

public class Company
{
	public int Id { get; init; }

	[MaxLength(255)]
	public required string Companyname { get; set; } = null!;
}