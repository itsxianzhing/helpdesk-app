using System.Text.Json;
using StackExchange.Redis;
using Helpdesk.Dtos.Common;
using Helpdesk.Dtos.Ticket;

namespace Helpdesk.Services;

public class TicketCacheService
{
    private readonly IConnectionMultiplexer _redis;

    private static readonly TimeSpan CacheDuration =
        TimeSpan.FromSeconds(60);

    private static readonly JsonSerializerOptions JsonOptions =
        new(JsonSerializerDefaults.Web);

    public TicketCacheService(
        IConnectionMultiplexer redis)
    {
        _redis = redis;
    }

    public async Task<PagedResponse<TicketListResponse>?> GetAsync(
        string key)
    {
        var db = _redis.GetDatabase();

        var cachedData = await db.StringGetAsync(key);

        if (!cachedData.HasValue)
        {
            return null;
        }

        return JsonSerializer.Deserialize<
            PagedResponse<TicketListResponse>>(
                cachedData.ToString(),
                JsonOptions);
    }

    public async Task SetAsync(
        string key,
        PagedResponse<TicketListResponse> data)
    {
        var db = _redis.GetDatabase();

        var serializedData = JsonSerializer.Serialize(
            data,
            JsonOptions);

        await db.StringSetAsync(
            key,
            serializedData,
            CacheDuration);
    }

    public async Task InvalidateAllAsync()
    {
        var server = _redis.GetServer(
            _redis.GetEndPoints()[0]);

        var db = _redis.GetDatabase();

        var keys = server.Keys(
            database: db.Database,
            pattern: "cache:tickets:*");

        foreach (var key in keys)
        {
            await db.KeyDeleteAsync(key);
        }
    }

    public async Task<TicketDetailResponse?> GetDetailAsync(int ticketId)
    {
        var db = _redis.GetDatabase();
        var cacheKey = $"cache:tickets:detail:{ticketId}";

        var cachedData = await db.StringGetAsync(cacheKey);

        if (!cachedData.HasValue)
            return null;

        return JsonSerializer.Deserialize<TicketDetailResponse>(
            cachedData.ToString(),
            JsonOptions
        );
    }

    public async Task SetDetailAsync(
        int ticketId,
        TicketDetailResponse ticket)
    {
        var db = _redis.GetDatabase();
        var cacheKey = $"cache:tickets:detail:{ticketId}";

        var serializedData = JsonSerializer.Serialize(
            ticket,
            JsonOptions
        );

        await db.StringSetAsync(
            cacheKey,
            serializedData,
            TimeSpan.FromSeconds(30)
        );
    }

    public async Task InvalidateDetailAsync(int ticketId)
    {
        var db = _redis.GetDatabase();

        await db.KeyDeleteAsync(
            $"cache:tickets:detail:{ticketId}"
        );
    }
}
