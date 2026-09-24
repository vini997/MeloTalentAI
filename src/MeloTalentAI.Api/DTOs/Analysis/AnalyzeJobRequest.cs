namespace MeloTalentAI.Api.DTOs.Analysis;

public class AnalyzeJobRequest
{
    public Guid? ResumeId { get; set; }

    public string JobTitle { get; set; } = string.Empty;

    public string CompanyName { get; set; } = string.Empty;

    public string JobDescription { get; set; } = string.Empty;

    public string? SourceUrl { get; set; }
}
