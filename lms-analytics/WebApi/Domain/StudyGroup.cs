using System.ComponentModel.DataAnnotations;

namespace WebApi.Domain;

public class StudyGroup
{
	public int Id { get; init; }

	[MaxLength(255)]
	public required string Program { get; set; } = null!;

	public required int AdmissionYear { get; set; }

	public required int GroupNumber { get; set; }
}