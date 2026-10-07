using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Helpdesk.Hubs;

[Authorize]
public class NotificationHub : Hub
{
}
