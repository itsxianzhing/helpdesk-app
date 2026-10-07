using System.Security.Claims;
using Microsoft.AspNetCore.SignalR;

namespace Helpdesk.Hubs;

public class SignalRUserIdProvider : IUserIdProvider
{
    public string? GetUserId(HubConnectionContext connection)
    {
        return connection.User?.FindFirstValue(
            ClaimTypes.NameIdentifier);
    }
}
