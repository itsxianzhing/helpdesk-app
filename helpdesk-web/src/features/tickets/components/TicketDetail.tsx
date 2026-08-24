import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Pencil } from "lucide-react";
import type { TicketDetailResponse } from "../types";
import { ApiError } from "../../../lib/apiError";
import { getTicketById } from "../api/ticketApi";
import { formatDate } from "../../../lib/formatDate";

interface TicketDetailProps {
  ticketId: number;
}

function TicketDetail({
  ticketId,
}: TicketDetailProps) {
  const [ticket, setTicket] =
    useState<TicketDetailResponse | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    async function fetchTicket() {
      setIsLoading(true);
      setError(null);

      try {
        const response =
          await getTicketById(ticketId);

        setTicket(response);
      } catch (error) {
        if (error instanceof ApiError) {
          setError(error.message);
        } else {
          setError("Failed to load ticket.");
        }
      } finally {
        setIsLoading(false);
      }
    }

    if (!Number.isInteger(ticketId)) {
      setError("Invalid ticket ID.");
      setIsLoading(false);
      return;
    }

    fetchTicket();
  }, [ticketId]);

  if (isLoading) {
    return (
      <div className="rounded-xl border bg-card p-6">
        <p className="text-sm text-muted-foreground">
          Loading ticket...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border bg-card p-6">
        <p className="text-sm text-destructive">
          {error}
        </p>
      </div>
    );
  }

  if (!ticket) {
    return null;
  }

  return (
    <div className="rounded-xl border bg-card">
      {/* Header */}
      <div className="border-b p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              #{ticket.ticketNumber}
            </p>

            <h1 className="mt-1 text-2xl font-semibold tracking-tight">
              {ticket.title}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
              {ticket.status}
            </span>

            <span className="rounded-full border px-3 py-1 text-xs font-medium">
              {ticket.priority}
            </span>

            <Link
              to={`/tickets/${ticket.id}/edit`}
              className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted"
            >
              <Pencil size={16} />
              Edit
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6 p-6">
        <div>
          <h2 className="text-sm font-medium">
            Description
          </h2>

          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
            {ticket.description}
          </p>
        </div>

        <div>
          <h2 className="text-sm font-medium">
            Created
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            {formatDate(ticket.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default TicketDetail;