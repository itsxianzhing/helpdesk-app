using Helpdesk.Services;
using Helpdesk.Dtos.Auth;
using Microsoft.AspNetCore.Mvc;

namespace Helpdesk.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;

    public AuthController(AuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(
        LoginRequest request,
        CancellationToken cancellationToken)
    {
        var result = await _authService.Login(
            request,
            cancellationToken);

        Response.Cookies.Append(
            "refreshToken",
            result.RefreshToken,
            new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = result.RefreshTokenExpiresAt,
                Path = "/api/Auth"
            });

        return Ok(result.Response);
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh(
        CancellationToken cancellationToken)
    {
        if (!Request.Cookies.TryGetValue(
            "refreshToken",
            out var refreshToken))
        {
            return Unauthorized(new
            {
                message = "Refresh token is missing."
            });
        }

        var result = await _authService.Refresh(
            refreshToken,
            cancellationToken);

        Response.Cookies.Append(
            "refreshToken",
            result.RefreshToken,
            new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = result.RefreshTokenExpiresAt,
                Path = "/api/Auth"
            });

        return Ok(result.Response);
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout(
        CancellationToken cancellationToken)
    {
        Request.Cookies.TryGetValue(
            "refreshToken",
            out var refreshToken);

        await _authService.Logout(
            refreshToken,
            cancellationToken);

        Response.Cookies.Delete(
            "refreshToken",
            new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Path = "/api/Auth"
            });

        return Ok(new
        {
            message = "Logout successful."
        });
    }
}