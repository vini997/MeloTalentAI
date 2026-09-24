using MeloTalentAI.Api.Domain.Enums;

namespace MeloTalentAI.Api.Domain.Entities;

public class JobApplication
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid UserId { get; set; }

    public Guid? ResumeId { get; set; }

    public string JobTitle { get; set; } = string.Empty;

    public string CompanyName { get; set; } = string.Empty;

    public string JobDescription { get; set; } = string.Empty;

    public string? SourceUrl { get; set; }

    public ApplicationStatus Status { get; set; } = ApplicationStatus.Saved;

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

    public DateTime? AppliedAtUtc { get; set; }

    public User User { get; set; } = null!;

    public Resume? Resume { get; set; }

    public JobAnalysis? Analysis { get; set; }
}
