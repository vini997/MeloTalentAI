namespace MeloTalentAI.Api.Domain.Entities;

public class Resume
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid UserId { get; set; }

    public string FileName { get; set; } = string.Empty;

    public string ExtractedText { get; set; } = string.Empty;

    public DateTime UploadedAtUtc { get; set; } = DateTime.UtcNow;

    public User User { get; set; } = null!;

    public ICollection<JobApplication> JobApplications { get; set; } = [];
}
