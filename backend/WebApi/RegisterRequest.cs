using System.ComponentModel.DataAnnotations;

namespace WebApi;

public sealed record RegisterRequest([property: EmailAddress] string Email, string Username, string Password, int Role);