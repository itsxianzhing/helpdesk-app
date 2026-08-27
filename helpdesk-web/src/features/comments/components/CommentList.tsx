import type { CommentResponse } from "../types";
import CommentItem from "./CommentItem";

interface CommentListProps {
  comments: CommentResponse[];
  currentUserId: number;
  onUpdated: (
    comment: CommentResponse,
  ) => void;
  onDeleted: (commentId: number) => void;
}

function CommentList({
  comments,
  currentUserId,
  onUpdated,
  onDeleted,
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
          currentUserId={currentUserId}
          onUpdated={onUpdated}
          onDeleted={onDeleted}
        />
      ))}
    </div>
  );
}

export default CommentList;