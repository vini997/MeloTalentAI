namespace MeloTalentAI.Api.DTOs.Applications;

public sealed record ApplicationDetailsResponse(
    Guid Id,
    string JobTitle,
    string CompanyName,
    string JobDescription,
    string? SourceUrl,
    string Status,
    DateTime CreatedAtUtc,
    DateTime? AppliedAtUtc,
    int MatchScore,
    List<string> MatchingSkills,
    List<string> MissingSkills,
    string Recommendations,
    string? GeneratedCoverLetter,
    List<string> InterviewQuestions,
    DateTime AnalyzedAtUtc
);
