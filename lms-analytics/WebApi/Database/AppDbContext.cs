using Microsoft.EntityFrameworkCore;
using WebApi.Domain;

namespace WebApi.Database;

public sealed class AppDbContext(DbContextOptions<AppDbContext> options, DbSet<Feedback> feedbacks) : DbContext(options)
{
	public DbSet<Company> Companies { get; set; } = null!;

	public DbSet<Manager> Managers { get; set; } = null!;

	public DbSet<Teacher> Teachers { get; set; } = null!;

	public DbSet<StudyGroup> StudyGroups { get; set; } = null!;

	public DbSet<Student> Students { get; set; } = null!;

	public DbSet<Feedback> Feedbacks { get; init; } = feedbacks;
}