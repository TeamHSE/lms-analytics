using System.ComponentModel.DataAnnotations;
using WebApi.Features.Companies;
using WebApi.Features.Users;

namespace WebApi.Features.Managers;

public class Discipline(string name, int companyId)
{
	public int Id { get; private init; }

	public int CompanyId { get; private set; } = companyId;

	[MaxLength(300)]
	public string Name { get; private set; } = name;

	public Company Company { get; private set; } = null!;

	public List<Student> Students { get; private init; } = [];

	public List<Teacher> Teachers { get; private init; } = [];

	public List<Manager> Managers { get; private init; } = [];
}