using System.Security.Claims;
using Helpdesk.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Helpdesk.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class NotificationsController : ControllerBase
{
    private readonly NotificationService _notificationService;

    public NotificationsController(
        NotificationService notificationService)
    {
        _notificationService = notificationService;
    }

    private int CurrentUserId =>
        int.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<IActionResult> GetAll(
        CancellationToken cancellationToken)
    {
        var notifications =
            await _notificationService.GetAll(
                CurrentUserId,
                cancellationToken);

        return Ok(notifications);
    }

    [HttpGet("unread-count")]
    public async Task<IActionResult> GetUnreadCount(
        CancellationToken cancellationToken)
    {
        var count =
            await _notificationService.GetUnreadCount(
                CurrentUserId,
                cancellationToken);

        return Ok(new
        {
            count
        });
    }

    [HttpPatch("{id:int}/read")]
    public async Task<IActionResult> MarkAsRead(
        int id,
        CancellationToken cancellationToken)
    {
        await _notificationService.MarkAsRead(
            id,
            CurrentUserId,
            cancellationToken);

        return NoContent();
    }

    [HttpPatch("read-all")]
    public async Task<IActionResult> MarkAllAsRead(
        CancellationToken cancellationToken)
    {
        await _notificationService.MarkAllAsRead(
            CurrentUserId,
            cancellationToken);

        return NoContent();
    }
}
