import type { CommentResponse } from "../types";
import { formatDate } from "../../../lib/formatDate";

interface CommentItemProps {
  comment: CommentResponse;
}

function CommentItem({
  comment,
}: CommentItemProps) {
  return (
    <article className="rounded-lg border p-4">
      <div>
        <p className="text-sm font-medium">
          {comment.userName}
        </p>

        <p className="mt-1 text-xs text-muted-foreground">
          {formatDate(comment.createdAt)}
        </p>
      </div>

      <p className="mt-4 whitespace-pre-wrap text-sm leading-6">
        {comment.content}
      </p>
    </article>
  );
}

export default CommentItem;