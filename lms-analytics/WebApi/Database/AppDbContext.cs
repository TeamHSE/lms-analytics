using Microsoft.EntityFrameworkCore;
using WebApi.Features;
using WebApi.Features.Feedbacks;
using WebApi.Features.Users;

namespace WebApi.Database;

public sealed class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
	public DbSet<Company> Companies { get; init; } = null!;

	public DbSet<Manager> Managers { get; init; } = null!;

	public DbSet<Teacher> Teachers { get; init; } = null!;

	public DbSet<StudyGroup> StudyGroups { get; init; } = null!;

	public DbSet<Student> Students { get; init; } = null!;

	public DbSet<Feedback> Feedbacks { get; init; } = null!;
}