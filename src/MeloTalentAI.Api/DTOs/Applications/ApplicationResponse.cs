namespace MeloTalentAI.Api.DTOs.Applications;

public sealed record ApplicationResponse(
    Guid Id,
    string JobTitle,
    string CompanyName,
    string? SourceUrl,
    string Status,
    DateTime CreatedAtUtc,
    DateTime? AppliedAtUtc,
    int? MatchScore
);
