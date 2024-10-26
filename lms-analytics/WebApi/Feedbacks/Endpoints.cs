using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApi.Database;
using WebApi.Domain;

namespace WebApi.Feedbacks;

public static class Endpoints
{
	public static void MapFeedbacks(this IEndpointRouteBuilder app)
	{
		var api = app.MapGroup("feedbacks")
			.WithTags("Обратная связь");

		api.MapPost("/", AddFeedbackHandler);
		api.MapGet("/", GetFeedbacksHandler);
	}

	private static async Task<IResult> AddFeedbackHandler([FromServices] AppDbContext dbContext, SendFeedbackRequest request)
	{
		Feedback feedback = new()
		{
			SenderId = request.SenderId,
			ReceiverId = request.ReceiverId,
			Text = request.Text,
			CreatedAt = DateTimeOffset.Now,
		};

		var sender = await dbContext.Users.Where(user => user.Id == feedback.SenderId)
			.Include(user => user.SentFeedbacks)
			.SingleOrDefaultAsync();
		var receiver = await dbContext.Users.Where(user => user.Id == feedback.SenderId)
			.Include(user => user.SentFeedbacks)
			.SingleOrDefaultAsync();

		if (sender is null || receiver is null)
		{
			return Results.NotFound();
		}

		sender.SentFeedbacks.Add(feedback);
		receiver.ReceivedFeedbacks.Add(feedback);

		await dbContext.SaveChangesAsync();

		var feedbackResponse = new
		{
			feedback.Id,
			feedback.SenderId,
			feedback.ReceiverId,
			feedback.Text,
			feedback.CreatedAt,
		};
		return Results.Created($"/feedbacks/{feedback.Id}", feedbackResponse);
	}

	private static async Task<IResult> GetFeedbacksHandler([FromServices] AppDbContext dbContext, [FromQuery] int userId)
	{
		var user = await dbContext.Users.FindAsync(userId);

		if (user is null)
		{
			return Results.NotFound();
		}

		var feedbacks = await dbContext.Feedbacks
			.Where(feedback => feedback.ReceiverId == userId)
			.ToListAsync();

		var anonymousFeedbacks = feedbacks.Select(
			feedback => new
			{
				feedback.ReceiverId,
				feedback.Text,
				feedback.CreatedAt,
			});
		return Results.Ok(anonymousFeedbacks);
	}

	private sealed record SendFeedbackRequest(int SenderId, int ReceiverId, [MaxLength(1000)] string Text);
}