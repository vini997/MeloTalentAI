using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using MeloTalentAI.Api.Domain.Entities;
using MeloTalentAI.Api.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UglyToad.PdfPig;

namespace MeloTalentAI.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/resumes")]
public sealed class ResumesController(
    TalentAiDbContext dbContext) : ControllerBase
{
    [HttpPost("upload")]
    [RequestSizeLimit(10_000_000)]
    public async Task<IActionResult> Upload(
        IFormFile file,
        CancellationToken cancellationToken)
    {
        if (file.Length == 0)
        {
            return BadRequest(new
            {
                message = "Please select a PDF file."
            });
        }

        if (!string.Equals(
                Path.GetExtension(file.FileName),
                ".pdf",
                StringComparison.OrdinalIgnoreCase))
        {
            return BadRequest(new
            {
                message = "Only PDF files are supported."
            });
        }

        var userIdValue =
            User.FindFirstValue(ClaimTypes.NameIdentifier) ??
            User.FindFirstValue(JwtRegisteredClaimNames.Sub);

        if (!Guid.TryParse(userIdValue, out var userId))
        {
            return Unauthorized();
        }

        var extractedText = new StringBuilder();

        try
        {
            await using var stream = file.OpenReadStream();
            using var document = PdfDocument.Open(stream);

            foreach (var page in document.GetPages())
            {
                extractedText.AppendLine(page.Text);
            }
        }
        catch
        {
            return BadRequest(new
            {
                message = "The PDF could not be read."
            });
        }

        if (string.IsNullOrWhiteSpace(extractedText.ToString()))
        {
            return BadRequest(new
            {
                message = "No readable text was found in the PDF."
            });
        }

        var resume = new Resume
        {
            UserId = userId,
            FileName = Path.GetFileName(file.FileName),
            ExtractedText = extractedText.ToString()
        };

        dbContext.Resumes.Add(resume);
        await dbContext.SaveChangesAsync(cancellationToken);

        return Ok(new
        {
            resumeId = resume.Id,
            resume.FileName,
            resume.UploadedAtUtc,
            characterCount = resume.ExtractedText.Length
        });
    }
}
