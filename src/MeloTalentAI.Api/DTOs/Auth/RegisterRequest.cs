namespace MeloTalentAI.Api.DTOs.Auth;

public sealed record RegisterRequest(
    string FullName,
    string Email,
    string Password
);
