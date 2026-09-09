import {
  useState,
  type FormEvent,
} from "react";
import { ApiError } from "../../../lib/apiError";
import { createComment } from "../api/commentApi";
import type { CommentResponse } from "../types";
import { useNotification } from "../../../app/notification/NotificationContext";

interface CommentFormProps {
  ticketId: number;
  onCreated: (comment: CommentResponse) => void;
}

function CommentForm({
  ticketId,
  onCreated,
}: CommentFormProps) {
  const [content, setContent] =
    useState("");

  const { showNotification } = useNotification();

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const trimmedContent =
      content.trim();

    if (!trimmedContent) {
      setError("Comment is required.");
      return;
    }

    if (trimmedContent.length > 1000) {
      setError(
        "Comment cannot exceed 1000 characters.",
      );
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const comment = await createComment(
        ticketId,
        {
          content: trimmedContent,
        },
      );

      onCreated(comment);

      showNotification(
        "Comment created successfully.",
        "success",
      );
      
      setContent("");
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError(
          "Failed to create comment.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3"
    >
      <label
        htmlFor="comment"
        className="text-sm font-medium"
      >
        Add a comment
      </label>

      <textarea
        id="comment"
        value={content}
        onChange={(event) => {
          setContent(event.target.value);
          setError(null);
        }}
        placeholder="Write a comment..."
        maxLength={1000}
        rows={4}
        required
        disabled={isSubmitting}
        aria-invalid={!!error}
        aria-describedby={
          error ? "comment-error" : undefined
        }
        className="w-full resize-y rounded-md border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
      />

      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {content.length}/1000
        </span>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting
            ? "Posting..."
            : "Add Comment"}
        </button>
      </div>

      {error && (
        <p
          id="comment-error"
          role="alert"
          className="text-sm text-destructive"
        >
          {error}
        </p>
      )}
    </form>
  );
}

export default CommentForm;