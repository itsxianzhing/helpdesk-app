using Helpdesk.Models;
using Microsoft.EntityFrameworkCore;

namespace Helpdesk.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(
        AppDbContext context,
        IConfiguration configuration,
        CancellationToken cancellationToken = default)
    {
        var adminPassword = configuration["DemoSeed:AdminPassword"];
        var userPassword = configuration["DemoSeed:UserPassword"];

        if (string.IsNullOrWhiteSpace(adminPassword))
            throw new InvalidOperationException(
                "DemoSeed:AdminPassword is not configured.");

        if (string.IsNullOrWhiteSpace(userPassword))
            throw new InvalidOperationException(
                "DemoSeed:UserPassword is not configured.");

        // Prevent duplicate seed
        var demoAdminExists = await context.Users
            .IgnoreQueryFilters()
            .AnyAsync(
                u => u.Email == "demo.admin@helpdesk.local",
                cancellationToken);

        if (demoAdminExists)
            return;

        // =========================
        // Users
        // =========================

        var admin = new User
        {
            Name = "Demo Administrator",
            Email = "demo.admin@helpdesk.local",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(adminPassword),
            Role = Role.Admin,
            Status = UserStatus.Active,
            PhoneNumber = "081234567890"
        };

        var budi = new User
        {
            Name = "Budi Santoso",
            Email = "budi@helpdesk.local",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(userPassword),
            Role = Role.User,
            Status = UserStatus.Active,
            PhoneNumber = "081234567891"
        };

        var siti = new User
        {
            Name = "Siti Rahma",
            Email = "siti@helpdesk.local",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(userPassword),
            Role = Role.User,
            Status = UserStatus.Active,
            PhoneNumber = "081234567892"
        };

        var andi = new User
        {
            Name = "Andi Pratama",
            Email = "andi@helpdesk.local",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(userPassword),
            Role = Role.User,
            Status = UserStatus.Active,
            PhoneNumber = "081234567893"
        };

        context.Users.AddRange(
            admin,
            budi,
            siti,
            andi);

        await context.SaveChangesAsync(cancellationToken);

        // =========================
        // Tickets
        // =========================

        var ticket1 = new Ticket
        {
            TicketNumber = "TKT-2026-000001",
            Title = "Laptop tidak bisa terhubung ke Wi-Fi",
            Description =
                "Laptop tidak dapat terhubung ke jaringan Wi-Fi kantor sejak pagi.",
            Priority = TicketPriority.High,
            Status = TicketStatus.Open,
            UserId = budi.Id
        };

        var ticket2 = new Ticket
        {
            TicketNumber = "TKT-2026-000002",
            Title = "Request instalasi Visual Studio Code",
            Description =
                "Mohon bantu instalasi Visual Studio Code untuk kebutuhan development.",
            Priority = TicketPriority.Medium,
            Status = TicketStatus.InProgress,
            UserId = siti.Id
        };

        var ticket3 = new Ticket
        {
            TicketNumber = "TKT-2026-000003",
            Title = "Tidak bisa login email kantor",
            Description =
                "Password sudah benar tetapi akun email kantor tetap tidak dapat digunakan.",
            Priority = TicketPriority.High,
            Status = TicketStatus.Resolved,
            UserId = andi.Id
        };

        var ticket4 = new Ticket
        {
            TicketNumber = "TKT-2026-000004",
            Title = "VPN kantor tidak dapat terhubung",
            Description =
                "VPN gagal melakukan koneksi ketika digunakan dari jaringan rumah.",
            Priority = TicketPriority.Critical,
            Status = TicketStatus.Closed,
            UserId = budi.Id
        };

        var ticket5 = new Ticket
        {
            TicketNumber = "TKT-2026-000005",
            Title = "Monitor berkedip",
            Description =
                "Monitor pada workstation berkedip secara berkala ketika digunakan.",
            Priority = TicketPriority.Medium,
            Status = TicketStatus.Open,
            UserId = siti.Id
        };

        var ticket6 = new Ticket
        {
            TicketNumber = "TKT-2026-000006",
            Title = "Request akses shared folder",
            Description =
                "Membutuhkan akses ke shared folder tim Finance untuk pekerjaan.",
            Priority = TicketPriority.Low,
            Status = TicketStatus.InProgress,
            UserId = andi.Id
        };

        context.Tickets.AddRange(
            ticket1,
            ticket2,
            ticket3,
            ticket4,
            ticket5,
            ticket6);

        await context.SaveChangesAsync(cancellationToken);

        // =========================
        // Comments
        // =========================

        var comments = new[]
        {
            new Comment
            {
                Content =
                    "Saya sudah mencoba restart laptop dan reconnect Wi-Fi, tetapi masih belum bisa.",
                TicketId = ticket1.Id,
                UserId = budi.Id
            },

            new Comment
            {
                Content =
                    "Baik, kami akan cek konfigurasi jaringan pada laptop tersebut.",
                TicketId = ticket1.Id,
                UserId = admin.Id
            },

            new Comment
            {
                Content =
                    "Installer sudah disiapkan dan sedang dalam proses instalasi.",
                TicketId = ticket2.Id,
                UserId = admin.Id
            },

            new Comment
            {
                Content =
                    "Terima kasih. Saya tunggu sampai proses instalasinya selesai.",
                TicketId = ticket2.Id,
                UserId = siti.Id
            },

            new Comment
            {
                Content =
                    "Password sudah di-reset dan akun sudah bisa digunakan kembali.",
                TicketId = ticket3.Id,
                UserId = admin.Id
            },

            new Comment
            {
                Content =
                    "Sudah berhasil login kembali. Terima kasih.",
                TicketId = ticket3.Id,
                UserId = andi.Id
            },

            new Comment
            {
                Content =
                    "VPN sudah diperiksa dan konfigurasi client telah diperbarui.",
                TicketId = ticket4.Id,
                UserId = admin.Id
            },

            new Comment
            {
                Content =
                    "Koneksi VPN sekarang sudah normal.",
                TicketId = ticket4.Id,
                UserId = budi.Id
            },

            new Comment
            {
                Content =
                    "Monitor masih berkedip terutama ketika brightness dinaikkan.",
                TicketId = ticket5.Id,
                UserId = siti.Id
            },

            new Comment
            {
                Content =
                    "Kami akan menjadwalkan pengecekan perangkat secara langsung.",
                TicketId = ticket5.Id,
                UserId = admin.Id
            },

            new Comment
            {
                Content =
                    "Akses tersebut dibutuhkan untuk laporan bulanan.",
                TicketId = ticket6.Id,
                UserId = andi.Id
            },

            new Comment
            {
                Content =
                    "Request sudah diteruskan ke administrator folder.",
                TicketId = ticket6.Id,
                UserId = admin.Id
            }
        };

        context.Comments.AddRange(comments);

        await context.SaveChangesAsync(cancellationToken);

        // =========================
        // Activity Logs
        // =========================

        var now = DateTime.UtcNow;

        var activityLogs = new[]
        {
            new ActivityLog
            {
                UserId = budi.Id,
                Action = "Create",
                EntityType = "Ticket",
                EntityId = ticket1.Id,
                Description =
                    $"Created ticket {ticket1.TicketNumber}",
                CreatedAt = now.AddMinutes(-60)
            },

            new ActivityLog
            {
                UserId = siti.Id,
                Action = "Create",
                EntityType = "Ticket",
                EntityId = ticket2.Id,
                Description =
                    $"Created ticket {ticket2.TicketNumber}",
                CreatedAt = now.AddMinutes(-55)
            },

            new ActivityLog
            {
                UserId = andi.Id,
                Action = "Create",
                EntityType = "Ticket",
                EntityId = ticket3.Id,
                Description =
                    $"Created ticket {ticket3.TicketNumber}",
                CreatedAt = now.AddMinutes(-50)
            },

            new ActivityLog
            {
                UserId = budi.Id,
                Action = "Create",
                EntityType = "Ticket",
                EntityId = ticket4.Id,
                Description =
                    $"Created ticket {ticket4.TicketNumber}",
                CreatedAt = now.AddMinutes(-45)
            },

            new ActivityLog
            {
                UserId = siti.Id,
                Action = "Create",
                EntityType = "Ticket",
                EntityId = ticket5.Id,
                Description =
                    $"Created ticket {ticket5.TicketNumber}",
                CreatedAt = now.AddMinutes(-40)
            },

            new ActivityLog
            {
                UserId = andi.Id,
                Action = "Create",
                EntityType = "Ticket",
                EntityId = ticket6.Id,
                Description =
                    $"Created ticket {ticket6.TicketNumber}",
                CreatedAt = now.AddMinutes(-35)
            },

            new ActivityLog
            {
                UserId = admin.Id,
                Action = "Update",
                EntityType = "Ticket",
                EntityId = ticket2.Id,
                Description =
                    $"Admin updated ticket {ticket2.TicketNumber}",
                CreatedAt = now.AddMinutes(-25)
            },

            new ActivityLog
            {
                UserId = admin.Id,
                Action = "Update",
                EntityType = "Ticket",
                EntityId = ticket3.Id,
                Description =
                    $"Admin updated ticket {ticket3.TicketNumber}",
                CreatedAt = now.AddMinutes(-20)
            },

            new ActivityLog
            {
                UserId = admin.Id,
                Action = "Update",
                EntityType = "Ticket",
                EntityId = ticket4.Id,
                Description =
                    $"Admin updated ticket {ticket4.TicketNumber}",
                CreatedAt = now.AddMinutes(-15)
            },

            new ActivityLog
            {
                UserId = admin.Id,
                Action = "Create",
                EntityType = "Comment",
                EntityId = comments[1].Id,
                Description =
                    $"Created comment on ticket {ticket1.TicketNumber}",
                CreatedAt = now.AddMinutes(-10)
            }
        };

        context.ActivityLogs.AddRange(activityLogs);

        await context.SaveChangesAsync(cancellationToken);
    }
}