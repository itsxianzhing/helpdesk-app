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

        var keys = server.Keys(
            database: _redis.GetDatabase().Database,
            pattern: "cache:tickets:list:*");

        var db = _redis.GetDatabase();

        foreach (var key in keys)
        {
            await db.KeyDeleteAsync(key);
        }
    }
}
