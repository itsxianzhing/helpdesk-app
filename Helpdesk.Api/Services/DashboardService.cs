using System.Text.Json;
using Helpdesk.Data;
using Helpdesk.Dtos.Dashboard;
using Helpdesk.Dtos.Ticket;
using Helpdesk.Extensions;
using Helpdesk.Mappers;
using Helpdesk.Models;
using StackExchange.Redis;
using Microsoft.EntityFrameworkCore;

namespace Helpdesk.Services;

public class DashboardService
{
    private readonly AppDbContext _context;
    private readonly CurrentUserService _currentUserService;
    private readonly IConnectionMultiplexer _redis;

    private static readonly TimeSpan CacheDuration =
        TimeSpan.FromSeconds(30);

    private static readonly JsonSerializerOptions JsonOptions =
        new(JsonSerializerDefaults.Web);

    public DashboardService(
        AppDbContext context,
        CurrentUserService currentUserService,
        IConnectionMultiplexer redis)
    {
        _context = context;
        _currentUserService = currentUserService;
        _redis = redis;
    }

    public async Task<DashboardResponse> GetDashboard(
        CancellationToken cancellationToken)
    {
        var currentUser = await _currentUserService.GetAsync(
            cancellationToken);

        var isAdmin = currentUser.Role == Helpdesk.Models.Role.Admin;

        var cacheKey = isAdmin
            ? "cache:dashboard:admin"
            : $"cache:dashboard:user:{currentUser.Id}";

        var db = _redis.GetDatabase();

        // 1. Cache hit: gunakan hasil yang tersimpan.
        var cachedData = await db.StringGetAsync(cacheKey);

        if (cachedData.HasValue)
        {
            var cachedDashboard =
                JsonSerializer.Deserialize<DashboardResponse>(
                    cachedData.ToString(),
                    JsonOptions);

            if (cachedDashboard != null)
            {
                return cachedDashboard;
            }
        }

        // 2. Cache miss: hitung statistik dari database.
        IQueryable<Ticket> query =
            _context.Tickets.AsNoTracking();

        if (!isAdmin)
        {
            query = query.Where(t =>
                t.UserId == currentUser.Id);
        }

        var statusCounts = await query
            .GroupBy(t => t.Status)
            .Select(group => new
            {
                Status = group.Key,
                Count = group.Count()
            })
            .ToListAsync(cancellationToken);

        int GetCount(TicketStatus status)
        {
            return statusCounts
                .FirstOrDefault(x => x.Status == status)
                ?.Count ?? 0;
        }

        var result = new DashboardResponse
        {
            TotalTickets = statusCounts.Sum(x => x.Count),
            OpenTickets = GetCount(TicketStatus.Open),
            InProgressTickets = GetCount(TicketStatus.InProgress),
            ResolvedTickets = GetCount(TicketStatus.Resolved),
            ClosedTickets = GetCount(TicketStatus.Closed)
        };

        // Tiket terbaru sesuai cakupan akses user.
        result.RecentTickets = await query
            .OrderByDescending(t => t.CreatedAt)
            .ThenByDescending(t => t.Id)
            .Take(5)
            .Select(TicketMapper.ToListResponseProjection)
            .ToListAsync(cancellationToken);

        // Jumlah user hanya untuk admin.
        if (isAdmin)
        {
            result.TotalUsers = await _context.Users
                .CountAsync(cancellationToken);
        }

        // 3. Simpan hasil ke Redis selama 30 detik.
        var serializedData = JsonSerializer.Serialize(
            result,
            JsonOptions);

        await db.StringSetAsync(
            cacheKey,
            serializedData,
            CacheDuration);

        return result;
    }
}
