using BCrypt.Net;
using Helpdesk.Data;
using Helpdesk.Dtos.Auth;
using Helpdesk.Models;
using Helpdesk.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace Helpdesk.Services;

public class AuthService
{
    private readonly AppDbContext _context;
    private readonly JwtService _jwtService;
    private readonly RefreshTokenService _refreshTokenService;

    public AuthService(
        AppDbContext context,
        JwtService jwtService,
        RefreshTokenService refreshTokenService)
    {
        _context = context;
        _jwtService = jwtService;
        _refreshTokenService = refreshTokenService;
    }

    public async Task<AuthResult> Login(
        LoginRequest request,
        CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(
                u =>
                    u.Email == request.Email &&
                    u.Status == UserStatus.Active,
                cancellationToken);

        if (user == null)
            throw new UnauthorizedException(
                "Invalid email or password.");

        var validPassword = BCrypt.Net.BCrypt.Verify(
            request.Password,
            user.PasswordHash);

        if (!validPassword)
            throw new UnauthorizedException(
                "Invalid email or password.");

        // Access token
        var accessToken = _jwtService.GenerateToken(user);

        // Refresh token
        var refreshToken = _refreshTokenService.GenerateToken();
        var refreshTokenHash =
            _refreshTokenService.HashToken(refreshToken);
        var refreshTokenExpiresAt =
            _refreshTokenService.GetExpiration();

        var refreshTokenEntity = new RefreshToken
        {
            UserId = user.Id,
            TokenHash = refreshTokenHash,
            ExpiresAt = refreshTokenExpiresAt,
            CreatedAt = DateTime.UtcNow
        };

        _context.RefreshTokens.Add(refreshTokenEntity);

        await _context.SaveChangesAsync(cancellationToken);

        return new AuthResult
        {
            Response = new AuthResponse
            {
                Token = accessToken,
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role.ToString()
            },
            RefreshToken = refreshToken,
            RefreshTokenExpiresAt = refreshTokenExpiresAt
        };
    }

    public async Task<AuthResult> Refresh(
        string refreshToken,
        CancellationToken cancellationToken)
    {
        var tokenHash = _refreshTokenService.HashToken(refreshToken);

        var storedToken = await _context.RefreshTokens
            .Include(rt => rt.User)
            .FirstOrDefaultAsync(
                rt => rt.TokenHash == tokenHash,
                cancellationToken);

        if (storedToken == null)
            throw new UnauthorizedException("Invalid refresh token.");

        if (storedToken.RevokedAt.HasValue)
            throw new UnauthorizedException("Refresh token has been revoked.");

        if (storedToken.ExpiresAt <= DateTime.UtcNow)
            throw new UnauthorizedException("Refresh token has expired.");

        if (storedToken.User == null ||
            storedToken.User.Status != UserStatus.Active)
            throw new UnauthorizedException("User is inactive.");

        // Revoke old refresh token
        storedToken.RevokedAt = DateTime.UtcNow;

        // Generate new tokens
        var accessToken = _jwtService.GenerateToken(storedToken.User);

        var newRefreshToken = _refreshTokenService.GenerateToken();
        var newRefreshTokenHash =
            _refreshTokenService.HashToken(newRefreshToken);
        var newRefreshTokenExpiresAt =
            _refreshTokenService.GetExpiration();

        var newRefreshTokenEntity = new RefreshToken
        {
            UserId = storedToken.User.Id,
            TokenHash = newRefreshTokenHash,
            ExpiresAt = newRefreshTokenExpiresAt,
            CreatedAt = DateTime.UtcNow
        };

        _context.RefreshTokens.Add(newRefreshTokenEntity);

        await _context.SaveChangesAsync(cancellationToken);

        return new AuthResult
        {
            Response = new AuthResponse
            {
                Token = accessToken,
                Id = storedToken.User.Id,
                Name = storedToken.User.Name,
                Email = storedToken.User.Email,
                Role = storedToken.User.Role.ToString()
            },
            RefreshToken = newRefreshToken,
            RefreshTokenExpiresAt = newRefreshTokenExpiresAt
        };
    }

    public async Task Logout(
        string? refreshToken,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(refreshToken))
            return;

        var tokenHash = _refreshTokenService.HashToken(refreshToken);

        var storedToken = await _context.RefreshTokens
            .FirstOrDefaultAsync(
                rt => rt.TokenHash == tokenHash,
                cancellationToken);

        if (storedToken == null)
            return;

        if (!storedToken.RevokedAt.HasValue)
        {
            storedToken.RevokedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}