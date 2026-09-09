import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Plus, Search } from "lucide-react";
import { getUsers } from "../api/userApi";
import type { UserResponse } from "../types";
import { ApiError } from "../../../lib/apiError";
import useDebounce from "../../../hooks/useDebounce";
import UserTable from "../../users/components/UserTable";

function AdminUsersPage() {
  const [users, setUsers] = useState<UserResponse[]>([]);

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  // Filters
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");

  // Sorting
  const [sortBy, setSortBy] =
    useState("CreatedAt");

  const [descending, setDescending] =
    useState(true);

  const debouncedSearch = useDebounce(
    search,
    500,
  );

  // Pagination metadata
  const [totalItems, setTotalItems] =
    useState(0);

  const [totalPages, setTotalPages] =
    useState(0);

  // Request state
  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getUsers({
          page,
          pageSize,
          search:
            debouncedSearch || undefined,
          role: role || undefined,
          status: status || undefined,
          sortBy: sortBy || undefined,
          descending,
        });

        setUsers(response.items);
        setTotalItems(response.totalItems);
        setTotalPages(response.totalPages);
      } catch (error) {
        if (error instanceof ApiError) {
          setError(error.message);
        } else {
          setError("Failed to load users.");
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchUsers();
  }, [
    page,
    pageSize,
    debouncedSearch,
    role,
    status,
    sortBy,
    descending,
  ]);

  if (isLoading) {
    return (
      <div className="p-6">
        <p className="text-sm text-muted-foreground">
          Loading users...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-sm text-destructive">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          All Users
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Manage users and their access.
        </p>
      </div>

      <Link
        to="/admin/users/create"
        className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
      >
        <Plus size={16} />
        Create User
      </Link>

      {/* Filters */}
      <div className="grid grid-cols-2 gap-3 lg:flex">
        {/* Search */}
        <div className="relative col-span-2 flex-1 lg:col-span-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />

          <input
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search users..."
            className="w-full rounded-md border bg-background py-2.5 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Role */}
        <select
          value={role}
          onChange={(event) => {
            setRole(event.target.value);
            setPage(1);
          }}
          className="w-full rounded-md border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring lg:w-auto"
        >
          <option value="">All roles</option>
          <option value="User">User</option>
          <option value="Admin">Admin</option>
        </select>

        {/* Status */}
        <select
          value={status}
          onChange={(event) => {
            setStatus(event.target.value);
            setPage(1);
          }}
          className="w-full rounded-md border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring lg:w-auto"
        >
          <option value="">All statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(event) => {
            setSortBy(event.target.value);
            setPage(1);
          }}
          className="w-full rounded-md border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring lg:w-auto"
        >
          <option value="CreatedAt">Created At</option>
          <option value="Name">Name</option>
          <option value="Email">Email</option>
          <option value="Role">Role</option>
          <option value="Status">Status</option>
        </select>

        {/* Sort direction */}
        <button
          type="button"
          onClick={() => {
            setDescending((current) => !current);
            setPage(1);
          }}
          className="w-full rounded-md border px-3 py-2.5 text-sm hover:bg-muted lg:w-auto"
        >
          {descending ? "Descending" : "Ascending"}
        </button>
      </div>

      {/* Table */}
      <UserTable users={users} />

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing{" "}
          {totalItems === 0
            ? 0
            : (page - 1) * pageSize + 1}
          –
          {Math.min(
            page * pageSize,
            totalItems,
          )}{" "}
          of {totalItems} users
        </p>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={
              page === 1 || isLoading
            }
            onClick={() =>
              setPage(
                (current) => current - 1,
              )
            }
            className="rounded-md border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>

          <span className="px-3 py-2 text-sm">
            {page} / {totalPages}
          </span>

          <button
            type="button"
            disabled={
              page === totalPages ||
              isLoading ||
              totalPages === 0
            }
            onClick={() =>
              setPage(
                (current) => current + 1,
              )
            }
            className="rounded-md border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminUsersPage;