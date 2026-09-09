import type { TicketListResponse } from "../types";
import { Link } from "react-router";

interface TicketTableProps {
  tickets: TicketListResponse[];
  detailPath: (ticketId: number) => string;
  showCreateButton?: boolean;
}

function TicketTable({
  tickets,
  detailPath,
}: TicketTableProps) {
  if (tickets.length === 0) {
    return (
      <div>
        <p className="font-medium">No tickets found</p>

        <p className="mt-1 text-sm text-muted-foreground">
          There are no tickets to display.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b bg-muted/50">
          <tr>
            <th className="px-4 py-3 text-left font-medium">
              Ticket
            </th>

            <th className="px-4 py-3 text-left font-medium">
              Title
            </th>

            <th className="px-4 py-3 text-left font-medium">
              Status
            </th>

            <th className="px-4 py-3 text-left font-medium">
              Priority
            </th>

            <th className="px-4 py-3 text-left font-medium">
              Comments
            </th>

            <th className="px-4 py-3 text-left font-medium">
              User
            </th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {tickets.map((ticket) => (
            <tr
              key={ticket.id}
              className="transition hover:bg-muted/50"
            >
              <td className="px-4 py-3">
                <Link
                  to={detailPath(ticket.id)}
                  className="font-medium hover:underline"
                >
                  {ticket.ticketNumber}
                </Link>
              </td>

              <td className="px-4 py-3">
                {ticket.title}
              </td>

              <td className="px-4 py-3">
                {ticket.status}
              </td>

              <td className="px-4 py-3">
                {ticket.priority}
              </td>

              <td className="px-4 py-3">
                {ticket.commentCount}
              </td>

              <td className="px-4 py-3">
                {ticket.userName}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TicketTable;