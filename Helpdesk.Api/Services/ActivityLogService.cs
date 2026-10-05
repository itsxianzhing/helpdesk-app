using Helpdesk.Data;
using Helpdesk.Models;
using Helpdesk.Dtos.Common;
using Helpdesk.Dtos.ActivityLogs;
using Helpdesk.Extensions;
using Microsoft.EntityFrameworkCore;

namespace Helpdesk.Services;

public class ActivityLogService
{
    private readonly AppDbContext _context;
    private readonly CurrentUserService _currentUserService;

    public ActivityLogService(
        AppDbContext context,
        CurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public void Add(
        string action,
        string entityType,
        int entityId,
        string? description = null)
    {
        var activityLog = new ActivityLog
        {
            UserId = _currentUserService.UserId,
            Action = action,
            EntityType = entityType,
            EntityId = entityId,
            Description = description,
            CreatedAt = DateTime.UtcNow
        };

        _context.ActivityLogs.Add(activityLog);
    }

    public async Task<PagedResponse<ActivityLogResponse>> GetAll(
        ActivityLogQueryRequest request,
        CancellationToken cancellationToken)
    {
        IQueryable<ActivityLog> query =
            _context.ActivityLogs.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var search = request.Search.Trim();

            query = query.Where(log =>
                (log.Description != null &&
                 log.Description.Contains(search)) ||
                log.Action.Contains(search) ||
                log.EntityType.Contains(search) ||
                (log.User != null &&
                 log.User.Name.Contains(search)));
        }

        if (!string.IsNullOrWhiteSpace(request.Action))
        {
            query = query.Where(log =>
                log.Action == request.Action);
        }

        if (!string.IsNullOrWhiteSpace(request.EntityType))
        {
            query = query.Where(log =>
                log.EntityType == request.EntityType);
        }

        if (request.UserId.HasValue)
        {
            query = query.Where(log =>
                log.UserId == request.UserId.Value);
        }

        query = request.Descending
            ? query.OrderByDescending(log => log.CreatedAt)
            : query.OrderBy(log => log.CreatedAt);

        var totalItems = await query.CountAsync(
            cancellationToken);

        var logs = await query
            .ApplyPagination(
                request.Page,
                request.PageSize)
            .Select(log => new ActivityLogResponse
            {
                Id = log.Id,
                UserId = log.UserId,
                UserName = log.User != null
                    ? log.User.Name
                    : null,
                Action = log.Action,
                EntityType = log.EntityType,
                EntityId = log.EntityId,
                Description = log.Description,
                CreatedAt = log.CreatedAt
            })
            .ToListAsync(cancellationToken);

        var totalPages = (int)Math.Ceiling(
            (double)totalItems /
            request.PageSize);

        return new PagedResponse<ActivityLogResponse>
        {
            Items = logs,
            Page = request.Page,
            PageSize = request.PageSize,
            TotalItems = totalItems,
            TotalPages = totalPages
        };
    }
}
