import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Pencil, Trash2 } from "lucide-react";
import type { TicketDetailResponse } from "../types";
import type { CommentResponse } from "../../comments/types";
import { ApiError } from "../../../lib/apiError";
import {
  getTicketById,
  deleteTicket,
} from "../api/ticketApi";
import { formatDate } from "../../../lib/formatDate";
import CommentList from "../../comments/components/CommentList";
import CommentForm from "../../comments/components/CommentForm";
import { useAuth } from "../../auth/hooks/useAuth";

interface TicketDetailProps {
  ticketId: number;
}

function TicketDetail({ ticketId }: TicketDetailProps) {
  const { auth } = useAuth();
  const navigate = useNavigate();

  const [ticket, setTicket] =
    useState<TicketDetailResponse | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [isDeleting, setIsDeleting] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [actionError, setActionError] =
    useState<string | null>(null);

  useEffect(() => {
    async function fetchTicket() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getTicketById(ticketId);

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

  async function handleDelete() {
    if (!ticket || isDeleting) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this ticket?",
    );

    if (!confirmed) {
      return;
    }

    setActionError(null);
    setIsDeleting(true);

    try {
      await deleteTicket(ticket.id);

      navigate("/tickets");
    } catch (error) {
      if (error instanceof ApiError) {
        setActionError(error.message);
      } else {
        setActionError("Failed to delete ticket.");
      }
    } finally {
      setIsDeleting(false);
    }
  }

  function handleCommentCreated(comment: CommentResponse) {
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

  function handleCommentDeleted(commentId: number) {
    setTicket((currentTicket) => {
      if (!currentTicket) {
        return currentTicket;
      }

      return {
        ...currentTicket,
        comments: currentTicket.comments.filter(
          (comment) => comment.id !== commentId,
        ),
      };
    });
  }

  if (isLoading) {
    return (
      <div className="p-4">
        <p className="text-sm text-muted-foreground">
          Loading ticket...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <p
          role="alert"
          className="text-sm text-destructive"
        >
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
    <div className="overflow-hidden rounded-lg border bg-background">
      {/* Header */}
      <div className="border-b p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground">
              #{ticket.ticketNumber}
            </p>

            <h1 className="mt-1 break-words text-2xl font-semibold tracking-tight">
              {ticket.title}
            </h1>
          </div>

          <div className="flex flex-col items-start gap-2 sm:items-end">
            <div className="flex flex-wrap items-center gap-2">
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

              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Trash2 size={16} />

                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>

            {actionError && (
              <p className="text-sm text-destructive">
                {actionError}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6 p-4 sm:p-6">
        <div>
          <h2 className="text-sm font-medium">
            Description
          </h2>

          <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-muted-foreground">
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

export default TicketDetail;