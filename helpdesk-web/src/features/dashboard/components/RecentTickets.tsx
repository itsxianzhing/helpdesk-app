import { Link } from "react-router";
import type { TicketListResponse } from "../../tickets/types";
import { formatDate } from "../../../lib/formatDate";

interface RecentTicketsProps {
  tickets: TicketListResponse[];
  viewAllPath: string;
  detailBasePath: string;
  showCreateButton?: boolean;
  description?: string;
}

function RecentTickets({
  tickets,
  viewAllPath,
  detailBasePath,
  showCreateButton = false,
  description,
}: RecentTicketsProps) {
  return (
    <div className="rounded-xl border bg-card">
      <div className="border-b p-6">
        <h2 className="font-semibold">
          Recent Tickets
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          {description}
        </p>
      </div>

      {tickets.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
          <p className="font-medium">
            No tickets yet
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            {showCreateButton
              ? "Create your first ticket to get help from the support team."
              : "There are no tickets to display yet."}
          </p>

          {showCreateButton && (
            <Link
              to="/tickets/new"
              className="mt-4 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              Create Ticket
            </Link>
          )}
        </div>
      ) : (
        <div className="divide-y">
          {tickets.map((ticket) => (
            <Link
              key={ticket.id}
              to={`${detailBasePath}/${ticket.id}`}
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

                <span className="rounded-full border px-2.5 py-1 text-xs font-medium">
                  {ticket.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="border-t p-4">
        <Link
          to={viewAllPath}
          className="text-sm font-medium hover:underline"
        >
          View all tickets →
        </Link>
      </div>
    </div>
  );
}

export default RecentTickets;