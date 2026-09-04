import { Link } from "react-router";
import type { TicketListResponse } from "../../tickets/types";
import { formatDate } from "../../../lib/formatDate";

interface RecentTicketsProps {
  tickets: TicketListResponse[];
}

function RecentTickets({
  tickets,
}: RecentTicketsProps) {
  return (
    <div className="rounded-xl border bg-card">
      <div className="border-b p-6">
        <h2 className="font-semibold">
          Recent Tickets
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Your latest tickets.
        </p>
      </div>

      {tickets.length === 0 ? (
        <div className="p-6 text-sm text-muted-foreground">
          No tickets found.
        </div>
      ) : (
        <div className="divide-y">
          {tickets.map((ticket) => (
            <Link
              key={ticket.id}
              to={`/tickets/${ticket.id}`}
              className="block p-4 hover:bg-muted/50"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-medium">
                    {ticket.title}
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {ticket.ticketNumber} ·{" "}
                    {formatDate(ticket.createdAt)}
                  </p>
                </div>

                <div className="shrink-0 text-sm">
                  {ticket.status}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecentTickets;