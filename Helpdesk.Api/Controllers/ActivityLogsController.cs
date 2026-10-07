using Helpdesk.Dtos.ActivityLogs;
using Helpdesk.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Helpdesk.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class ActivityLogsController : ControllerBase
{
    private readonly ActivityLogService _activityLogService;

    public ActivityLogsController(
        ActivityLogService activityLogService)
    {
        _activityLogService = activityLogService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] ActivityLogQueryRequest request,
        CancellationToken cancellationToken)
    {
        var result = await _activityLogService.GetAll(
            request,
            cancellationToken);

        return Ok(result);
    }
}
