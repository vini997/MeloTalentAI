namespace MeloTalentAI.Api.DTOs.Analysis;

public class AnalyzeJobResponse
{
    public Guid JobApplicationId { get; set; }

    public Guid AnalysisId { get; set; }

    public string JobTitle { get; set; } = string.Empty;

    public string CompanyName { get; set; } = string.Empty;

    public int MatchScore { get; set; }

    public List<string> MatchingSkills { get; set; } = [];

    public List<string> MissingSkills { get; set; } = [];

    public string Recommendations { get; set; } = string.Empty;

    public string? GeneratedCoverLetter { get; set; }

    public List<string> InterviewQuestions { get; set; } = [];
}
