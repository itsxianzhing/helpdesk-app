import { useEffect, useState } from "react";
import type { TicketDetailResponse } from "../../tickets/types";
import { ApiError } from "../../../lib/apiError";
import {
  getTicketById,
  updateAdminTicket,
} from "../../tickets/api/ticketApi";
import CommentList from "../../comments/components/CommentList";
import CommentForm from "../../comments/components/CommentForm";
import type { CommentResponse } from "../../comments/types";
import { useAuth } from "../../auth/hooks/useAuth";

interface AdminTicketDetailProps {
  ticketId: number;
}

function AdminTicketDetail({
  ticketId,
}: AdminTicketDetailProps) {
  const { auth } = useAuth();

  const [ticket, setTicket] =
    useState<TicketDetailResponse | null>(null);

  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");

  const [isLoading, setIsLoading] =
    useState(true);

  const [isUpdating, setIsUpdating] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [actionError, setActionError] =
    useState<string | null>(null);

  useEffect(() => {
    async function fetchTicket() {
      setIsLoading(true);
      setError(null);

      try {
        const response =
          await getTicketById(ticketId);

        setTicket(response);
        setStatus(response.status);
        setPriority(response.priority);
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

  async function handleUpdate() {
    if (!ticket || isUpdating) {
      return;
    }

    setActionError(null);
    setIsUpdating(true);

    try {
      const response =
        await updateAdminTicket(
          ticket.id,
          {
            status,
            priority,
            version: ticket.version,
          },
        );

      setTicket(response);
      setStatus(response.status);
      setPriority(response.priority);
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.statusCode === 409) {
          setActionError(
            "This ticket was modified by another user. Please refresh and try again.",
          );
        } else {
          setActionError(error.message);
        }
      } else {
        setActionError(
          "Failed to update ticket.",
        );
      }
    } finally {
      setIsUpdating(false);
    }
  }

  function handleCommentCreated(
    comment: CommentResponse,
  ) {
    setTicket((currentTicket) => {
      if (!currentTicket) {
        return currentTicket;
      }

      return {
        ...currentTicket,
        comments: [
          ...currentTicket.comments,
          comment,
        ],
      };
    });
  }

  function handleCommentUpdated(
    updatedComment: CommentResponse,
  ) {
    setTicket((currentTicket) => {
      if (!currentTicket) {
        return currentTicket;
      }

      return {
        ...currentTicket,
        comments: currentTicket.comments.map(
          (comment) =>
            comment.id === updatedComment.id
              ? updatedComment
              : comment,
        ),
      };
    });
  }

  function handleCommentDeleted(
    commentId: number,
  ) {
    setTicket((currentTicket) => {
      if (!currentTicket) {
        return currentTicket;
      }

      return {
        ...currentTicket,
        comments: currentTicket.comments.filter(
          (comment) =>
            comment.id !== commentId,
        ),
      };
    });
  }

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

  if (!auth) {
    return null;
  }

  return (
    <div className="rounded-xl border bg-card">
      {/* Ticket information */}
      <div className="border-b p-6">
        <p className="text-sm text-muted-foreground">
          #{ticket.ticketNumber}
        </p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          {ticket.title}
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Submitted by {ticket.userName}
        </p>
      </div>

      <div className="space-y-6 p-6">
        {/* Description */}
        <div>
          <h2 className="text-sm font-medium">
            Description
          </h2>

          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
            {ticket.description}
          </p>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Status
          </label>

          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value)
            }
            disabled={isUpdating}
            className="w-full rounded-md border bg-background px-3 py-2.5 text-sm"
          >
            <option value="Open">Open</option>

            <option value="InProgress">
              In Progress
            </option>

            <option value="Resolved">
              Resolved
            </option>

            <option value="Closed">
              Closed
            </option>
          </select>
        </div>

        {/* Priority */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Priority
          </label>

          <select
            value={priority}
            onChange={(event) =>
              setPriority(event.target.value)
            }
            disabled={isUpdating}
            className="w-full rounded-md border bg-background px-3 py-2.5 text-sm"
          >
            <option value="Low">Low</option>

            <option value="Medium">
              Medium
            </option>

            <option value="High">High</option>

            <option value="Critical">
              Critical
            </option>
          </select>
        </div>

        {actionError && (
          <p className="text-sm text-destructive">
            {actionError}
          </p>
        )}

        <button
          type="button"
          onClick={handleUpdate}
          disabled={isUpdating}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isUpdating
            ? "Updating..."
            : "Update Ticket"}
        </button>

        <div className="border-t pt-6">
          <CommentList
            comments={ticket.comments}
            currentUserId={auth.id}
            onUpdated={handleCommentUpdated}
            onDeleted={handleCommentDeleted}
          />

          <div className="mt-6">
            <CommentForm
              ticketId={ticket.id}
              onCreated={handleCommentCreated}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminTicketDetail;