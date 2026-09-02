import {
  useState,
  type FormEvent,
} from "react";
import { Pencil, Trash2 } from "lucide-react";

import type { CommentResponse } from "../types";
import { updateComment, deleteComment } from "../api/commentApi";
import { ApiError } from "../../../lib/apiError";
import { formatDate } from "../../../lib/formatDate";

interface CommentItemProps {
  comment: CommentResponse;
  currentUserId: number;
  onUpdated: (
    comment: CommentResponse,
  ) => void;
  onDeleted: (commentId: number) => void;
}

function CommentItem({
  comment,
  currentUserId,
  onUpdated,
  onDeleted,
}: CommentItemProps) {
  const [isEditing, setIsEditing] =
    useState(false);

  const [content, setContent] =
    useState(comment.content);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [isDeleting, setIsDeleting] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const isOwner =
    currentUserId === comment.userId;

  function handleCancel() {
    setContent(comment.content);
    setError(null);
    setIsEditing(false);
  }

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
      const updatedComment =
        await updateComment(comment.id, {
          content: trimmedContent,
          version: comment.version,
        });

      onUpdated(updatedComment);

      setIsEditing(false);
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.statusCode === 409) {
          setError(
            "This comment was modified by another user. Please refresh and try again.",
          );
        } else {
          setError(error.message);
        }
      } else {
        setError("Failed to update comment.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (isDeleting) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this comment?",
    );

    if (!confirmed) {
      return;
    }

    setError(null);
    setIsDeleting(true);

    try {
      await deleteComment(comment.id);

      onDeleted(comment.id);
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError("Failed to delete comment.");
      }
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <article className="rounded-lg border p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium">
            {comment.userName}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            {formatDate(comment.createdAt)}
          </p>
        </div>

        {isOwner && !isEditing && (
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              setError(null);
              setContent(comment.content);
              setIsEditing(true);
            }}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs hover:bg-muted"
          >
            <Pencil size={14} />
            Edit
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-destructive hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 size={14} />

            {isDeleting
              ? "Deleting..."
              : "Delete"}
          </button>
        </div>
      )}
      </div>

      {isEditing ? (
        <form
          onSubmit={handleSubmit}
          className="mt-4 space-y-3"
        >
          <textarea
            value={content}
            onChange={(event) =>
              setContent(event.target.value)
            }
            maxLength={1000}
            rows={4}
            disabled={isSubmitting}
            className="w-full resize-y rounded-md border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
          />

          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {content.length}/1000
            </span>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="rounded-md border px-3 py-2 text-sm hover:bg-muted disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground hover:opacity-90 disabled:opacity-50"
              >
                {isSubmitting
                  ? "Saving..."
                  : "Save"}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-destructive">
              {error}
            </p>
          )}
        </form>
      ) : (
        <p className="mt-4 whitespace-pre-wrap break-all text-sm leading-6">
          {comment.content}
        </p>
      )}
    </article>
  );
}

export default CommentItem;