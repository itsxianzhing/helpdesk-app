import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { createTicket } from "../api/ticketApi";
import { ApiError } from "../../../lib/apiError";

function TicketForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] =
  useState(false);

  const [error, setError] =
    useState<string | null>(null);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

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
      const ticket = await createTicket({
        title: trimmedTitle,
        description: trimmedDescription,
      });

      navigate(`/tickets/${ticket.id}`);
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError("Failed to create ticket.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
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
            placeholder="e.g. Cannot access email"
            maxLength={100}
            className="w-full rounded-md border bg-background px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-ring"
          />

          <div className="flex justify-end">
            <span className="text-xs text-muted-foreground">
              {title.length}/100
            </span>
          </div>
        </div>

        {/* Description */}
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
            placeholder="Describe the problem you're experiencing..."
            maxLength={1000}
            rows={7}
            className="w-full resize-y rounded-md border bg-background px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-ring"
          />

          <div className="flex justify-end">
            <span className="text-xs text-muted-foreground">
              {description.length}/1000
            </span>
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-destructive">
            {error}
          </p>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Link
            to="/tickets"
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
              ? "Creating..."
              : "Create Ticket"}
          </button>
        </div>
    </form>
  );
}

export default TicketForm;