using MeloTalentAI.Api.Domain.Entities;
using MeloTalentAI.Api.DTOs.Auth;
using MeloTalentAI.Api.Infrastructure.Persistence;
using MeloTalentAI.Api.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MeloTalentAI.Api.Controllers;

[ApiController]
[Route("api/auth")]
public sealed class AuthController(
    TalentAiDbContext dbContext,
    IPasswordHasher<User> passwordHasher,
    TokenService tokenService) : ControllerBase
{
    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register(
        RegisterRequest request,
        CancellationToken cancellationToken)
    {
        var fullName = request.FullName.Trim();
        var email = request.Email.Trim().ToLowerInvariant();

        if (string.IsNullOrWhiteSpace(fullName) ||
            string.IsNullOrWhiteSpace(email) ||
            request.Password.Length < 8)
        {
            return BadRequest(new
            {
                message = "Full name, email, and a password of at least 8 characters are required."
            });
        }

        var emailExists = await dbContext.Users
            .AnyAsync(user => user.Email == email, cancellationToken);

        if (emailExists)
        {
            return Conflict(new
            {
                message = "An account with this email already exists."
            });
        }

        var user = new User
        {
            FullName = fullName,
            Email = email
        };

        user.PasswordHash = passwordHasher.HashPassword(
            user,
            request.Password);

        dbContext.Users.Add(user);
        await dbContext.SaveChangesAsync(cancellationToken);

        var token = tokenService.CreateToken(user);

        return Ok(new AuthResponse(
            user.Id,
            user.FullName,
            user.Email,
            token));
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login(
        LoginRequest request,
        CancellationToken cancellationToken)
    {
        var email = request.Email.Trim().ToLowerInvariant();

        var user = await dbContext.Users
            .SingleOrDefaultAsync(
                item => item.Email == email,
                cancellationToken);

        if (user is null)
        {
            return Unauthorized(new
            {
                message = "Invalid email or password."
            });
        }

        var verificationResult = passwordHasher.VerifyHashedPassword(
            user,
            user.PasswordHash,
            request.Password);

        if (verificationResult == PasswordVerificationResult.Failed)
        {
            return Unauthorized(new
            {
                message = "Invalid email or password."
            });
        }

        var token = tokenService.CreateToken(user);

        return Ok(new AuthResponse(
            user.Id,
            user.FullName,
            user.Email,
            token));
    }
}
