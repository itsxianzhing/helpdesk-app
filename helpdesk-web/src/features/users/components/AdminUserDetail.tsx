import { useEffect, useState } from "react";
import { getUserById } from "../api/userApi";
import type { UserResponse } from "../types";
import { ApiError } from "../../../lib/apiError";
import { formatDate } from "../../../lib/formatDate";

interface AdminUserDetailProps {
  userId: number;
}

function AdminUserDetail({
  userId,
}: AdminUserDetailProps) {
  const [user, setUser] =
    useState<UserResponse | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      setIsLoading(true);
      setError(null);

      try {
        const response =
          await getUserById(userId);

        setUser(response);
      } catch (error) {
        if (error instanceof ApiError) {
          setError(error.message);
        } else {
          setError("Failed to load user.");
        }
      } finally {
        setIsLoading(false);
      }
    }

    if (!Number.isInteger(userId)) {
      setError("Invalid user ID.");
      setIsLoading(false);
      return;
    }

    fetchUser();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="rounded-xl border bg-card p-6">
        Loading user...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border bg-card p-6 text-sm text-destructive">
        {error}
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold">
          User Details
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Manage this user's account and access.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <p className="text-sm text-muted-foreground">
            Name
          </p>

          <p className="mt-1 font-medium">
            {user.name}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Email
          </p>

          <p className="mt-1 font-medium">
            {user.email}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Role
          </p>

          <p className="mt-1 font-medium">
            {user.role}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Status
          </p>

          <p className="mt-1 font-medium">
            {user.status}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Created
          </p>

          <p className="mt-1 font-medium">
            {formatDate(user.createdAt)}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Last Updated
          </p>

          <p className="mt-1 font-medium">
            {user.updatedAt
              ? formatDate(user.updatedAt)
              : "-"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminUserDetail;