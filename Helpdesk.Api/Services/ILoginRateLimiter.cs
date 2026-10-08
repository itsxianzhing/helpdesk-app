namespace Helpdesk.Services;

public interface ILoginRateLimiter
{
    Task<bool> IsAllowedAsync(string ipAddress);

    Task RecordFailedAttemptAsync(string ipAddress);

    Task ResetAsync(string ipAddress);
}