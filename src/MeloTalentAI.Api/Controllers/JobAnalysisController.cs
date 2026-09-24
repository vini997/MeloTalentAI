using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using MeloTalentAI.Api.Domain.Entities;
using MeloTalentAI.Api.DTOs.Analysis;
using MeloTalentAI.Api.Infrastructure.Persistence;
using MeloTalentAI.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MeloTalentAI.Api.Controllers;

[ApiController]
[Route("api/job-analysis")]
[Authorize]
public class JobAnalysisController : ControllerBase
{
    private readonly TalentAiDbContext _dbContext;
    private readonly JobAnalysisService _analysisService;

    public JobAnalysisController(
        TalentAiDbContext dbContext,
        JobAnalysisService analysisService)
    {
        _dbContext = dbContext;
        _analysisService = analysisService;
    }

    [HttpPost]
    public async Task<ActionResult<AnalyzeJobResponse>> Analyze(
        AnalyzeJobRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.JobTitle) ||
            string.IsNullOrWhiteSpace(request.CompanyName) ||
            string.IsNullOrWhiteSpace(request.JobDescription))
        {
            return BadRequest(new
            {
                message = "Job title, company, and description are required."
            });
        }

        var userIdValue =
            User.FindFirstValue(ClaimTypes.NameIdentifier) ??
            User.FindFirstValue(JwtRegisteredClaimNames.Sub);

        if (!Guid.TryParse(userIdValue, out var userId))
        {
            return Unauthorized();
        }

        Resume? resume;

        if (request.ResumeId.HasValue)
        {
            resume = await _dbContext.Resumes
                .FirstOrDefaultAsync(resume =>
                    resume.Id == request.ResumeId &&
                    resume.UserId == userId);
        }
        else
        {
            resume = await _dbContext.Resumes
                .Where(resume => resume.UserId == userId)
                .OrderByDescending(resume => resume.UploadedAtUtc)
                .FirstOrDefaultAsync();
        }

        if (resume is null)
        {
            return BadRequest(new
            {
                message = "Upload a resume before analyzing a job."
            });
        }

        var result = _analysisService.Analyze(
            resume.ExtractedText,
            request.JobDescription);

        var application = new JobApplication
        {
            UserId = userId,
            ResumeId = resume.Id,
            JobTitle = request.JobTitle.Trim(),
            CompanyName = request.CompanyName.Trim(),
            JobDescription = request.JobDescription.Trim(),
            SourceUrl = request.SourceUrl?.Trim()
        };

        var analysis = new JobAnalysis
        {
            JobApplicationId = application.Id,
            MatchScore = result.MatchScore,
            MatchingSkills = result.MatchingSkills,
            MissingSkills = result.MissingSkills,
            Recommendations = result.Recommendations,
            GeneratedCoverLetter =
                $"Dear {request.CompanyName} Hiring Team,\n\n" +
                $"I am interested in the {request.JobTitle} position. " +
                "My software development experience and technical background " +
                "align well with this opportunity. I would welcome the chance " +
                "to discuss how I can contribute to your team.\n\n" +
                "Sincerely,\nVinicius Melo",
            InterviewQuestions = result.InterviewQuestions
        };

        application.Analysis = analysis;

        _dbContext.JobApplications.Add(application);
        await _dbContext.SaveChangesAsync();

        return Ok(new AnalyzeJobResponse
        {
            JobApplicationId = application.Id,
            AnalysisId = analysis.Id,
            JobTitle = application.JobTitle,
            CompanyName = application.CompanyName,
            MatchScore = analysis.MatchScore,
            MatchingSkills = analysis.MatchingSkills,
            MissingSkills = analysis.MissingSkills,
            Recommendations = analysis.Recommendations,
            GeneratedCoverLetter = analysis.GeneratedCoverLetter,
            InterviewQuestions = analysis.InterviewQuestions
        });
    }
}
