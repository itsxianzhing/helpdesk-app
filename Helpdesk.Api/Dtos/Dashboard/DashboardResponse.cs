using Helpdesk.Dtos.Ticket;

namespace Helpdesk.Dtos.Dashboard;

public class DashboardResponse
{
    public int TotalTickets { get; set; }

    public int OpenTickets { get; set; }

    public int InProgressTickets { get; set; }

    public int ResolvedTickets { get; set; }

    public int ClosedTickets { get; set; }

    public int? TotalUsers { get; set; }

    public List<TicketListResponse> RecentTickets { get; set; } = [];
}
