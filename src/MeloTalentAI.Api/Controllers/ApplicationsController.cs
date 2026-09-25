using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using MeloTalentAI.Api.Domain.Enums;
using MeloTalentAI.Api.DTOs.Applications;
using MeloTalentAI.Api.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MeloTalentAI.Api.Controllers;

[ApiController]
[Route("api/applications")]
[Authorize]
public class ApplicationsController : ControllerBase
{
    private readonly TalentAiDbContext _dbContext;

    public ApplicationsController(TalentAiDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<ApplicationResponse>>> GetAll()
    {
        if (!TryGetUserId(out var userId))
        {
            return Unauthorized();
        }

        var applications = await _dbContext.JobApplications
            .AsNoTracking()
            .Include(application => application.Analysis)
            .Where(application => application.UserId == userId)
            .OrderByDescending(application => application.CreatedAtUtc)
            .ToListAsync();

        var response = applications
            .Select(ToResponse)
            .ToList();

        return Ok(response);
    }

[HttpGet("{id:guid}")]
public async Task<ActionResult<ApplicationDetailsResponse>> GetById(Guid id)
{
    if (!TryGetUserId(out var userId))
    {
        return Unauthorized();
    }

    var application = await _dbContext.JobApplications
        .AsNoTracking()
        .Include(item => item.Analysis)
        .FirstOrDefaultAsync(item =>
            item.Id == id &&
            item.UserId == userId);

    if (application is null || application.Analysis is null)
    {
        return NotFound(new
        {
            message = "Application analysis not found."
        });
    }

    var analysis = application.Analysis;

    return Ok(new ApplicationDetailsResponse(
        application.Id,
        application.JobTitle,
        application.CompanyName,
        application.JobDescription,
        application.SourceUrl,
        application.Status.ToString(),
        application.CreatedAtUtc,
        application.AppliedAtUtc,
        analysis.MatchScore,
        analysis.MatchingSkills,
        analysis.MissingSkills,
        analysis.Recommendations,
        analysis.GeneratedCoverLetter,
        analysis.InterviewQuestions,
        analysis.AnalyzedAtUtc
    ));
}

    [HttpPatch("{id:guid}/status")]
    public async Task<ActionResult<ApplicationResponse>> UpdateStatus(
        Guid id,
        UpdateApplicationStatusRequest request)
    {
        if (!TryGetUserId(out var userId))
        {
            return Unauthorized();
        }

        if (!Enum.TryParse<ApplicationStatus>(
                request.Status,
                ignoreCase: true,
                out var status))
        {
            return BadRequest(new
            {
                message =
                    "Status must be Saved, Applied, Interview, Offer, or Rejected."
            });
        }

        var application = await _dbContext.JobApplications
            .Include(item => item.Analysis)
            .FirstOrDefaultAsync(item =>
                item.Id == id &&
                item.UserId == userId);

        if (application is null)
        {
            return NotFound(new
            {
                message = "Application not found."
            });
        }

        application.Status = status;

        if (status != ApplicationStatus.Saved &&
            application.AppliedAtUtc is null)
        {
            application.AppliedAtUtc = DateTime.UtcNow;
        }

        await _dbContext.SaveChangesAsync();

        return Ok(ToResponse(application));
    }

    private bool TryGetUserId(out Guid userId)
    {
        var value =
            User.FindFirstValue(ClaimTypes.NameIdentifier) ??
            User.FindFirstValue(JwtRegisteredClaimNames.Sub);

        return Guid.TryParse(value, out userId);
    }

    private static ApplicationResponse ToResponse(
        Domain.Entities.JobApplication application)
    {
        return new ApplicationResponse(
            application.Id,
            application.JobTitle,
            application.CompanyName,
            application.SourceUrl,
            application.Status.ToString(),
            application.CreatedAtUtc,
            application.AppliedAtUtc,
            application.Analysis?.MatchScore
        );
    }
}

