import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  getUserById,
  updateUser,
  deleteUser,
} from "../api/userApi";
import type { UserResponse } from "../types";
import { ApiError } from "../../../lib/apiError";
import { formatDate } from "../../../lib/formatDate";

interface AdminUserDetailProps {
  userId: number;
}

function AdminUserDetail({
  userId,
}: AdminUserDetailProps) {
  const navigate = useNavigate();

  const [user, setUser] =
    useState<UserResponse | null>(null);

  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");

  const [isLoading, setIsLoading] =
    useState(true);

  const [isUpdating, setIsUpdating] =
    useState(false);

  const [isDeleting, setIsDeleting] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [actionError, setActionError] =
    useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      setIsLoading(true);
      setError(null);

      try {
        const response =
          await getUserById(userId);

        setUser(response);
        setRole(response.role);
        setStatus(response.status);
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

  async function handleUpdate() {
    if (!user || isUpdating || isDeleting) {
      return;
    }

    const validRoles = [
      "User",
      "Admin",
    ];

    const validStatuses = [
      "Active",
      "Inactive",
    ];

    if (!validRoles.includes(role)) {
      setActionError("Invalid role.");
      return;
    }

    if (!validStatuses.includes(status)) {
      setActionError("Invalid status.");
      return;
    }

    setActionError(null);
    setIsUpdating(true);

    try {
      const response = await updateUser(
        user.id,
        {
          role,
          status,
          version: user.version,
        },
      );

      setUser(response);
      setRole(response.role);
      setStatus(response.status);
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.statusCode === 409) {
          setActionError(
            "This user was modified by another admin. Please refresh and try again.",
          );
        } else {
          setActionError(error.message);
        }
      } else {
        setActionError(
          "Failed to update user.",
        );
      }
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleDelete() {
    if (!user || isDeleting || isUpdating) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${user.name}?`,
    );

    if (!confirmed) {
      return;
    }

    setActionError(null);
    setIsDeleting(true);

    try {
      await deleteUser(user.id);

      navigate("/admin/users");
    } catch (error) {
      if (error instanceof ApiError) {
        setActionError(error.message);
      } else {
        setActionError(
          "Failed to delete user.",
        );
      }
    } finally {
      setIsDeleting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-xl border bg-card p-6">
        <p className="text-sm text-muted-foreground">
          Loading user...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border bg-card p-6">
        <p className="text-sm text-destructive">
          {error}
        </p>
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

        <div className="space-y-2">
          <label
            htmlFor="role"
            className="text-sm text-muted-foreground"
          >
            Role
          </label>

          <select
            id="role"
            value={role}
            onChange={(event) => {
              setRole(event.target.value);
              setActionError(null);
            }}
            disabled={
              isUpdating || isDeleting
            }
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          >
            <option value="User">
              User
            </option>

            <option value="Admin">
              Admin
            </option>
          </select>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="status"
            className="text-sm text-muted-foreground"
          >
            Status
          </label>

          <select
            id="status"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setActionError(null);
            }}
            disabled={
              isUpdating || isDeleting
            }
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          >
            <option value="Active">
              Active
            </option>

            <option value="Inactive">
              Inactive
            </option>
          </select>
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

      {actionError && (
        <p
          role="alert"
          className="mt-6 text-sm text-destructive"
        >
          {actionError}
        </p>
      )}

      <div className="mt-6 flex justify-between">
        <button
          type="button"
          onClick={handleDelete}
          disabled={
            isDeleting || isUpdating
          }
          className="rounded-md border px-4 py-2 text-sm font-medium text-destructive disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isDeleting
            ? "Deleting..."
            : "Delete User"}
        </button>

        <button
          type="button"
          onClick={handleUpdate}
          disabled={
            isUpdating || isDeleting
          }
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isUpdating
            ? "Updating..."
            : "Update User"}
        </button>
      </div>
    </div>
  );
}

export default AdminUserDetail;