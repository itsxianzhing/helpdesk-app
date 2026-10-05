using Helpdesk.Dtos.Common;

namespace Helpdesk.Dtos.ActivityLogs;

public class ActivityLogQueryRequest : PaginationRequest
{
    public string? Search { get; set; }

    public string? Action { get; set; }

    public string? EntityType { get; set; }

    public int? UserId { get; set; }

    public bool Descending { get; set; } = true;
}