using System.Security.Cryptography;
using System.Text;

namespace Helpdesk.Services;

public class RefreshTokenService
{
    private readonly IConfiguration _configuration;

    public RefreshTokenService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public string GenerateToken()
    {
        var bytes = RandomNumberGenerator.GetBytes(64);

        return Convert.ToBase64String(bytes)
            .Replace("+", "-")
            .Replace("/", "_")
            .TrimEnd('=');
    }

    public string HashToken(string token)
    {
        var bytes = SHA256.HashData(
            Encoding.UTF8.GetBytes(token));

        return Convert.ToHexString(bytes);
    }

    public DateTime GetExpiration()
    {
        return DateTime.UtcNow.AddDays(
            int.Parse(
                _configuration["Jwt:RefreshTokenExpireDays"]!));
    }
}
