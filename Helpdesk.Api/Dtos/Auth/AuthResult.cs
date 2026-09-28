namespace Helpdesk.Dtos.Auth;

public class AuthResult
{
    public AuthResponse Response { get; set; } = new();

    public string RefreshToken { get; set; } = "";

    public DateTime RefreshTokenExpiresAt { get; set; }
}