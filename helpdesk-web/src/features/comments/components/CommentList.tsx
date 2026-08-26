import type { CommentResponse } from "../types";
import CommentItem from "./CommentItem";

interface CommentListProps {
  comments: CommentResponse[];
}

function CommentList({
  comments,
}: CommentListProps) {
  if (comments.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-center">
        <p className="text-sm text-muted-foreground">
          No comments yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
        />
      ))}
    </div>
  );
}

export default CommentList;