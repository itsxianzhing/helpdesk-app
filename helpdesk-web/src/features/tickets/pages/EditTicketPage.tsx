import {
  useEffect,
  useState,
  type FormEvent,
} from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router";
import { ArrowLeft } from "lucide-react";

import {
  getTicketById,
  updateMyTicket,
} from "../api/ticketApi";

import type {
  TicketDetailResponse,
} from "../types";

import { ApiError } from "../../../lib/apiError";

function EditTicketPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const ticketId = Number(id);

  const [ticket, setTicket] =
    useState<TicketDetailResponse | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(true);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

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
        setTitle(response.title);
        setDescription(response.description);
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

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!ticket) {
      return;
    }

    setError(null);

    const trimmedTitle = title.trim();
    const trimmedDescription =
      description.trim();

    if (!trimmedTitle) {
      setError("Title is required.");
      return;
    }

    if (trimmedTitle.length > 100) {
      setError(
        "Title cannot exceed 100 characters.",
      );
      return;
    }

    if (!trimmedDescription) {
      setError("Description is required.");
      return;
    }

    if (trimmedDescription.length > 1000) {
      setError(
        "Description cannot exceed 1000 characters.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      await updateMyTicket(ticket.id, {
        title: trimmedTitle,
        description: trimmedDescription,
        version: ticket.version,
      });

      navigate(`/tickets/${ticket.id}`);
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError("Failed to update ticket.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <p className="text-sm text-muted-foreground">
          Loading ticket...
        </p>
      </div>
    );
  }

  if (error && !ticket) {
    return (
      <div className="space-y-4 p-6">
        <p className="text-sm text-destructive">
          {error}
        </p>

        <Link
          to="/tickets"
          className="text-sm underline"
        >
          Back to tickets
        </Link>
      </div>
    );
  }

  if (!ticket) {
    return null;
  }

  return (
    <main className="max-w-2xl space-y-6">
      <div>
        <Link
          to={`/tickets/${ticket.id}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={16} />
          Back to ticket
        </Link>

        <h1 className="mt-4 text-2xl font-semibold tracking-tight">
          Edit Ticket
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Update your ticket information.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-lg border bg-card p-6"
      >
        <div className="space-y-2">
          <label
            htmlFor="title"
            className="text-sm font-medium"
          >
            Title
          </label>

          <input
            id="title"
            type="text"
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            maxLength={100}
            disabled={isSubmitting}
            className="w-full rounded-md border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
          />

          <div className="flex justify-end">
            <span className="text-xs text-muted-foreground">
              {title.length}/100
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="description"
            className="text-sm font-medium"
          >
            Description
          </label>

          <textarea
            id="description"
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            maxLength={1000}
            rows={7}
            disabled={isSubmitting}
            className="w-full resize-y rounded-md border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
          />

          <div className="flex justify-end">
            <span className="text-xs text-muted-foreground">
              {description.length}/1000
            </span>
          </div>
        </div>

        {error && (
          <p className="text-sm text-destructive">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-3">
          <Link
            to={`/tickets/${ticket.id}`}
            className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting
              ? "Saving..."
              : "Save Changes"}
          </button>
        </div>
      </form>
    </main>
  );
}

export default EditTicketPage;