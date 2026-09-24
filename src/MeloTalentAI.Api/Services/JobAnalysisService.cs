namespace MeloTalentAI.Api.Services;

public class JobAnalysisService
{
    private static readonly string[] KnownSkills =
    [
        "C#", ".NET", "ASP.NET", "Java", "JavaScript", "TypeScript",
        "React", "Angular", "Vue", "Node.js", "Python", "PHP",
        "Magento", "WordPress", "HTML", "CSS", "SQL", "PostgreSQL",
        "MySQL", "SQL Server", "Oracle", "MongoDB", "Redis",
        "Entity Framework", "REST API", "Git", "GitHub", "Docker",
        "Kubernetes", "AWS", "Azure", "Linux", "CI/CD",
        "Agile", "Scrum", "Technical Support", "Help Desk"
    ];

    public AnalysisResult Analyze(
        string resumeText,
        string jobDescription)
    {
        var matchingSkills = KnownSkills
            .Where(skill =>
                Contains(resumeText, skill) &&
                Contains(jobDescription, skill))
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();

        var requiredSkills = KnownSkills
            .Where(skill => Contains(jobDescription, skill))
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();

        var missingSkills = requiredSkills
            .Except(matchingSkills, StringComparer.OrdinalIgnoreCase)
            .ToList();

        var matchScore = requiredSkills.Count == 0
            ? 50
            : (int)Math.Round(
                matchingSkills.Count * 100.0 / requiredSkills.Count);

        var recommendations = missingSkills.Count == 0
            ? "Your resume demonstrates strong compatibility with the technical requirements of this position."
            : $"Highlight your relevant experience and consider strengthening these areas: {string.Join(", ", missingSkills)}.";

        var questions = requiredSkills
            .Take(4)
            .Select(skill =>
                $"Can you describe a project where you used {skill}?")
            .ToList();

        if (questions.Count == 0)
        {
            questions.Add(
                "Can you describe a project that best demonstrates your experience for this role?");
        }

        return new AnalysisResult(
            matchScore,
            matchingSkills,
            missingSkills,
            recommendations,
            questions);
    }

    private static bool Contains(string text, string value)
    {
        return text.Contains(
            value,
            StringComparison.OrdinalIgnoreCase);
    }
}

public record AnalysisResult(
    int MatchScore,
    List<string> MatchingSkills,
    List<string> MissingSkills,
    string Recommendations,
    List<string> InterviewQuestions);
