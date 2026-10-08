using StackExchange.Redis;

namespace Helpdesk.Services;

public class LoginRateLimiter : ILoginRateLimiter
{
    private readonly IConnectionMultiplexer _redis;

    private const int MaxAttempts = 5;
    private static readonly TimeSpan Window =
        TimeSpan.FromMinutes(5);

    public LoginRateLimiter(IConnectionMultiplexer redis)
    {
        _redis = redis;
    }

    public async Task<bool> IsAllowedAsync(string ipAddress)
    {
        var db = _redis.GetDatabase();

        var key = GetKey(ipAddress);

        var value = await db.StringGetAsync(key);

        if (!value.HasValue)
            return true;

        return (int)value < MaxAttempts;
    }

    public async Task RecordFailedAttemptAsync(string ipAddress)
    {
        var db = _redis.GetDatabase();

        var key = GetKey(ipAddress);

        var attempts = await db.StringIncrementAsync(key);

        if (attempts == 1)
        {
            await db.KeyExpireAsync(key, Window);
        }
    }

    public async Task ResetAsync(string ipAddress)
    {
        var db = _redis.GetDatabase();

        var key = GetKey(ipAddress);

        await db.KeyDeleteAsync(key);
    }

    private static string GetKey(string ipAddress)
    {
        return $"login_attempts:{ipAddress}";
    }
}