using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApi.Database;

namespace WebApi.Features.Feedbacks;

public static class Endpoints
{
	public static void MapFeedbacks(this IEndpointRouteBuilder app)
	{
		var api = app.MapGroup("feedbacks")
			.WithTags("Обратная связь");

		api.MapPost("teacher-student", AddTeacherStudentFeedback);
		api.MapPost("student-teacher", AddStudentTeacherFeedback);
		api.MapPost("x-student", AddCrossStudentsFeedback);

		api.MapGet("for-teacher/{teacherId:int}", GetForTeacherFeedbacks);
		api.MapGet("from-teacher/{teacherId:int}", GetFromTeacherFeedbacks);
		api.MapGet("for-student/{studentId:int}", GetForStudentFeedbacks);
		api.MapGet("from-student/{studentId:int}", GetFromStudentFeedbacks);
	}

	private static async Task<IResult> AddTeacherStudentFeedback([FromServices] AppDbContext dbContext, SendFeedbackRequest request)
	{
		Feedback feedback = new()
		{
			SenderId = request.SenderId,
			ReceiverId = request.ReceiverId,
			Text = request.Text,
			CreatedAt = DateTimeOffset.Now,
			SenderType = FeedbackPersonType.Teacher,
			ReceiverType = FeedbackPersonType.Student,
		};

		var teacher = await dbContext.Teachers
			.Where(x => x.Id == request.SenderId)
			.Include(x => x.SentFeedbacks)
			.SingleOrDefaultAsync();
		var student = await dbContext.Students
			.Where(x => x.Id == request.ReceiverId)
			.Include(x => x.ReceivedFeedbacks)
			.SingleOrDefaultAsync();

		if (teacher is null || student is null)
		{
			return Results.NotFound();
		}

		teacher.SentFeedbacks.Add(feedback);
		student.ReceivedFeedbacks.Add(feedback);

		await dbContext.SaveChangesAsync();

		return Results.Created($"/feedbacks/teacher-student/{feedback.Id}", feedback);
	}

	private static async Task<IResult> AddStudentTeacherFeedback([FromServices] AppDbContext dbContext, SendFeedbackRequest request)
	{
		Feedback feedback = new()
		{
			SenderId = request.SenderId,
			ReceiverId = request.ReceiverId,
			Text = request.Text,
			CreatedAt = DateTimeOffset.Now,
			SenderType = FeedbackPersonType.Student,
			ReceiverType = FeedbackPersonType.Teacher,
		};

		var student = await dbContext.Students
			.Where(x => x.Id == request.SenderId)
			.Include(x => x.SentFeedbacks)
			.SingleOrDefaultAsync();
		var teacher = await dbContext.Teachers
			.Where(x => x.Id == request.ReceiverId)
			.Include(x => x.ReceivedFeedbacks)
			.SingleOrDefaultAsync();

		if (student is null || teacher is null)
		{
			return Results.NotFound();
		}

		student.SentFeedbacks.Add(feedback);
		teacher.ReceivedFeedbacks.Add(feedback);

		await dbContext.SaveChangesAsync();

		return Results.Created($"/feedbacks/student-teacher/{feedback.Id}", feedback);
	}

	private static async Task<IResult> AddCrossStudentsFeedback([FromServices] AppDbContext dbContext, SendFeedbackRequest request)
	{
		Feedback feedback = new()
		{
			SenderId = request.SenderId,
			ReceiverId = request.ReceiverId,
			Text = request.Text,
			CreatedAt = DateTimeOffset.Now,
			SenderType = FeedbackPersonType.Student,
			ReceiverType = FeedbackPersonType.Student,
		};

		var sender = await dbContext.Students
			.Where(x => x.Id == request.SenderId)
			.Include(x => x.SentFeedbacks)
			.SingleOrDefaultAsync();
		var receiver = await dbContext.Students
			.Where(x => x.Id == request.ReceiverId)
			.Include(x => x.ReceivedFeedbacks)
			.SingleOrDefaultAsync();

		if (sender is null || receiver is null)
		{
			return Results.NotFound();
		}

		sender.SentFeedbacks.Add(feedback);
		receiver.ReceivedFeedbacks.Add(feedback);

		await dbContext.SaveChangesAsync();

		return Results.Created($"/feedbacks/x-student/{feedback.Id}", feedback);
	}

	private static async Task<IResult> GetForTeacherFeedbacks([FromServices] AppDbContext dbContext, [FromRoute] int teacherId)
	{
		var teacher = await dbContext.Teachers
			.Where(x => x.Id == teacherId)
			.Include(x => x.ReceivedFeedbacks)
			.SingleOrDefaultAsync();

		if (teacher is null)
		{
			return Results.NotFound();
		}

		return Results.Ok(teacher.ReceivedFeedbacks);
	}

	private static async Task<IResult> GetFromTeacherFeedbacks([FromServices] AppDbContext dbContext, [FromRoute] int teacherId)
	{
		var teacher = await dbContext.Teachers
			.Where(x => x.Id == teacherId)
			.Include(x => x.SentFeedbacks)
			.SingleOrDefaultAsync();

		if (teacher is null)
		{
			return Results.NotFound();
		}

		return Results.Ok(teacher.SentFeedbacks);
	}

	private static async Task<IResult> GetForStudentFeedbacks([FromServices] AppDbContext dbContext, [FromRoute] int studentId)
	{
		var student = await dbContext.Students
			.Where(x => x.Id == studentId)
			.Include(x => x.ReceivedFeedbacks)
			.SingleOrDefaultAsync();

		if (student is null)
		{
			return Results.NotFound();
		}

		return Results.Ok(student.ReceivedFeedbacks);
	}

	private static async Task<IResult> GetFromStudentFeedbacks([FromServices] AppDbContext dbContext, [FromRoute] int studentId)
	{
		var student = await dbContext.Students
			.Where(x => x.Id == studentId)
			.Include(x => x.SentFeedbacks)
			.SingleOrDefaultAsync();

		if (student is null)
		{
			return Results.NotFound();
		}

		return Results.Ok(student.SentFeedbacks);
	}

	private sealed record SendFeedbackRequest(int SenderId, int ReceiverId, [MaxLength(1000)] string Text);
}