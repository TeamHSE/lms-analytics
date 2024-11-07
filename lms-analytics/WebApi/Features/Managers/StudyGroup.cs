using System.ComponentModel.DataAnnotations;
using WebApi.Features.Companies;
using WebApi.Features.Users;

namespace WebApi.Features.Managers;

public class StudyGroup
{
	public StudyGroup(string program, string groupNumber, int admissionYear, int companyId)
	{
		Program = program;
		GroupNumber = groupNumber;
		AdmissionYear = admissionYear;
		CompanyId = companyId;
	}

	public int Id { get; private init; }

	[MaxLength(255)]
	public string Program { get; set; }

	public int AdmissionYear { get; set; }

	[MaxLength(255)]
	public string GroupNumber { get; set; }

	public int CompanyId { get; private init; }

	public Company Company { get; private init; } = null!;

	public List<Student> Students { get; private init; } = [];

	public List<Manager> Managers { get; private init; } = [];
}