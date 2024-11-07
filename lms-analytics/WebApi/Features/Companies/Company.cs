using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using WebApi.Features.Managers;

namespace WebApi.Features.Companies;

public class Company
{
	[SetsRequiredMembers]
	internal Company(string name)
	{
		Name = name;
	}

	public int Id { get; init; }

	[MaxLength(255)]
	public required string Name { get; set; }

	public List<Manager> Managers { get; private init; } = [];
}