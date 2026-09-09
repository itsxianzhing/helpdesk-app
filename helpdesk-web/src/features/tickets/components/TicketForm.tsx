import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { createTicket } from "../api/ticketApi";
import { ApiError } from "../../../lib/apiError";
import { useNotification } from "../../../app/notification/NotificationContext";

function TicketForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");

  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    submit?: string;
  }>({});

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedDescription =
      description.trim();

    const validationErrors: {
      title?: string;
      description?: string;
    } = {};

    if (!trimmedTitle) {
      validationErrors.title =
        "Title is required.";
    } else if (trimmedTitle.length > 100) {
      validationErrors.title =
        "Title cannot exceed 100 characters.";
    }

    if (!trimmedDescription) {
      validationErrors.description =
        "Description is required.";
    } else if (
      trimmedDescription.length > 1000
    ) {
      validationErrors.description =
        "Description cannot exceed 1000 characters.";
    }

    if (
      validationErrors.title ||
      validationErrors.description
    ) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const ticket = await createTicket({
        title: trimmedTitle,
        description: trimmedDescription,
      });

      showNotification(
        "Ticket created successfully.",
        "success",
      );

      navigate(`/tickets/${ticket.id}`);
    } catch (error) {
      if (error instanceof ApiError) {
        setErrors({
          submit: error.message,
        });
      } else {
        setErrors({
          submit: "Failed to create ticket.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
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
          onChange={(event) => {
            setTitle(event.target.value);

            setErrors((current) => ({
              ...current,
              title: undefined,
              submit: undefined,
            }));
          }}
          placeholder="e.g. Cannot access email"
          maxLength={100}
          required
          aria-invalid={!!errors.title}
          aria-describedby={
            errors.title
              ? "title-error"
              : undefined
          }
          className="w-full rounded-md border bg-background px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-ring"
        />

        <div className="flex justify-end">
          <span className="text-xs text-muted-foreground">
            {title.length}/100
          </span>
        </div>

        {errors.title && (
          <p
            id="title-error"
            className="text-sm text-destructive"
          >
            {errors.title}
          </p>
        )}
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
          onChange={(event) => {
            setDescription(event.target.value);

            setErrors((current) => ({
              ...current,
              description: undefined,
              submit: undefined,
            }));
          }}
          placeholder="Describe the problem you're experiencing..."
          maxLength={1000}
          rows={7}
          required
          aria-invalid={!!errors.description}
          aria-describedby={
            errors.description
              ? "description-error"
              : undefined
          }
          className="w-full resize-y rounded-md border bg-background px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-ring"
        />

        <div className="flex justify-end">
          <span className="text-xs text-muted-foreground">
            {description.length}/1000
          </span>
        </div>

        {errors.description && (
          <p
            id="description-error"
            className="text-sm text-destructive"
          >
            {errors.description}
          </p>
        )}
      </div>

      {/* Submit Error */}
      {errors.submit && (
        <p
          role="alert"
          className="text-sm text-destructive"
        >
          {errors.submit}
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