using WebApi.Features.Companies;
using WebApi.Features.Managers;

namespace WebApi.Features.Users;

public class Admin(string name, string surname, string? fatherName, string email)
	: User(name, surname, fatherName, email)
{
	public List<Manager> Managers { get; private init; } = null!;

	public List<Company> Companies { get; private init; } = null!;

	public Manager RegisterManager(string name, string surname, string? fatherName, string email, int companyId)
	{
		var manager = new Manager(name, surname, fatherName, email, companyId);
		Managers.Add(manager);
		return manager;
	}

	public Company RegisterCompany(string name)
	{
		var company = new Company(name);
		Companies.Add(company);
		return company;
	}
}