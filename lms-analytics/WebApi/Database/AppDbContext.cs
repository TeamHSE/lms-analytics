using Microsoft.EntityFrameworkCore;
using WebApi.Domain;

namespace WebApi.Database;

public sealed class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
	public DbSet<User> Users { get; set; } = null!;

	public DbSet<Company> Companies { get; set; } = null!;

	public DbSet<Manager> Managers { get; set; } = null!;

	public DbSet<Lecturer> Lecturers { get; set; } = null!;

	public DbSet<StudyGroup> StudyGroups { get; set; } = null!;

	public DbSet<Student> Students { get; set; } = null!;
}