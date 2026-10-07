using Helpdesk.Data;
using Helpdesk.Dtos.Notification;
using Helpdesk.Exceptions;
using Helpdesk.Models;
using Helpdesk.Hubs;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace Helpdesk.Services;

public class NotificationService
{
    private readonly AppDbContext _context;
    private readonly IHubContext<NotificationHub> _hubContext;

    public NotificationService(
        AppDbContext context,
        IHubContext<NotificationHub> hubContext)
    {
        _context = context;
        _hubContext = hubContext;
    }

    public Notification Add(
        int userId,
        string type,
        string title,
        string message,
        string? entityType = null,
        int? entityId = null)
    {
        var notification = new Notification
        {
            UserId = userId,
            Type = type,
            Title = title,
            Message = message,
            EntityType = entityType,
            EntityId = entityId,
            IsRead = false,
            CreatedAt = DateTime.UtcNow
        };

        _context.Notifications.Add(notification);

        return notification;
    }

    public async Task<List<NotificationResponse>> GetAll(
        int userId,
        CancellationToken cancellationToken)
    {
        return await _context.Notifications
            .AsNoTracking()
            .Where(n => n.UserId == userId)
            .OrderByDescending(n => n.CreatedAt)
            .Select(n => new NotificationResponse
            {
                Id = n.Id,
                Type = n.Type,
                Title = n.Title,
                Message = n.Message,
                EntityType = n.EntityType,
                EntityId = n.EntityId,
                IsRead = n.IsRead,
                CreatedAt = n.CreatedAt,
                ReadAt = n.ReadAt
            })
            .ToListAsync(cancellationToken);
    }

    public async Task<int> GetUnreadCount(
        int userId,
        CancellationToken cancellationToken)
    {
        return await _context.Notifications
            .CountAsync(
                n => n.UserId == userId && !n.IsRead,
                cancellationToken);
    }

    public async Task MarkAsRead(
        int id,
        int userId,
        CancellationToken cancellationToken)
    {
        var notification = await _context.Notifications
            .FirstOrDefaultAsync(
                n => n.Id == id && n.UserId == userId,
                cancellationToken);

        if (notification == null)
            throw new NotFoundException("Notification not found.");

        if (!notification.IsRead)
        {
            notification.IsRead = true;
            notification.ReadAt = DateTime.UtcNow;

            await _context.SaveChangesAsync(
                cancellationToken);
        }
    }

    public async Task MarkAllAsRead(
        int userId,
        CancellationToken cancellationToken)
    {
        var notifications = await _context.Notifications
            .Where(n =>
                n.UserId == userId &&
                !n.IsRead)
            .ToListAsync(cancellationToken);

        if (notifications.Count == 0)
            return;

        var now = DateTime.UtcNow;

        foreach (var notification in notifications)
        {
            notification.IsRead = true;
            notification.ReadAt = now;
        }

        await _context.SaveChangesAsync(
            cancellationToken);
    }

    public async Task SendCreated(
        IEnumerable<Notification> notifications)
    {
        foreach (var notification in notifications)
        {
            await _hubContext.Clients
                .User(notification.UserId.ToString())
                .SendAsync(
                    "NotificationCreated",
                    new NotificationResponse
                    {
                        Id = notification.Id,
                        Type = notification.Type,
                        Title = notification.Title,
                        Message = notification.Message,
                        EntityType = notification.EntityType,
                        EntityId = notification.EntityId,
                        IsRead = notification.IsRead,
                        CreatedAt = notification.CreatedAt,
                        ReadAt = notification.ReadAt
                    });
        }
    }
}
