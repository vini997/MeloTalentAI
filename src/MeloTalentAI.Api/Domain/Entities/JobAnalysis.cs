namespace MeloTalentAI.Api.Domain.Entities;

public class JobAnalysis
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid JobApplicationId { get; set; }

    public int MatchScore { get; set; }

    public List<string> MatchingSkills { get; set; } = [];

    public List<string> MissingSkills { get; set; } = [];

    public string Recommendations { get; set; } = string.Empty;

    public string? GeneratedCoverLetter { get; set; }

    public List<string> InterviewQuestions { get; set; } = [];

    public DateTime AnalyzedAtUtc { get; set; } = DateTime.UtcNow;

    public JobApplication JobApplication { get; set; } = null!;
}
