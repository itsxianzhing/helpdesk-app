using Helpdesk.Models.Base;

namespace Helpdesk.Models;

public class RefreshToken : BaseEntity
{
    public int UserId { get; set; }

    public string TokenHash { get; set; } = "";

    public DateTime ExpiresAt { get; set; }

    public DateTime? RevokedAt { get; set; }

    public User? User { get; set; }
}
