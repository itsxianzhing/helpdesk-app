import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';

import { getActivityLogs } from '../api/activityLogApi';
import { getUsers } from '../../users/api/userApi';
import type {
  ActivityLogAction,
  ActivityLogEntityType,
  ActivityLogResponse,
} from '../types';
import type {
  UserResponse
} from '../../users/types';
import { ApiError } from '../../../lib/apiError';
import useDebounce from '../../../hooks/useDebounce';
import ActivityLogTable from '../components/ActivityLogTable';

function ActivityLogsPage() {
  const [logs, setLogs] = useState<ActivityLogResponse[]>([]);

  // Users entity
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [userId, setUserId] = useState<number | ''>('');

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  // Filters
  const [search, setSearch] = useState('');
  const [action, setAction] = useState<ActivityLogAction | ''>('');
  const [entityType, setEntityType] = useState<ActivityLogEntityType | ''>('');

  // Sorting
  const [descending, setDescending] = useState(true);

  const debouncedSearch = useDebounce(search, 500);

  // Pagination metadata
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Request state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await getUsers({
          page: 1,
          pageSize: 100,
          sortBy: 'Name',
          descending: false,
        });

        setUsers(response.items);
      } catch {
        // Activity logs tetap bisa digunakan
        // meskipun daftar user gagal dimuat.
      }
    }

    fetchUsers();
  }, []);

  useEffect(() => {
    async function fetchActivityLogs() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getActivityLogs({
          page,
          pageSize,
          search: debouncedSearch || undefined,
          action: action || undefined,
          entityType: entityType || undefined,
          userId: userId || undefined,
          descending,
        });

        setLogs(response.items);
        setTotalItems(response.totalItems);
        setTotalPages(response.totalPages);
      } catch (error) {
        if (error instanceof ApiError) {
          setError(error.message);
        } else {
          setError('Failed to load activity logs.');
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchActivityLogs();
  }, [
    page,
    pageSize,
    debouncedSearch,
    userId,
    action,
    entityType,
    descending,
  ]);

  if (isLoading) {
    return (
      <div className="p-6">
        <p className="text-sm text-muted-foreground">
          Loading activity logs...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-sm text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Activity Logs
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          View important activities performed in the system.
        </p>
      </div>

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
            placeholder="Search activity logs..."
            aria-label="Search activity logs"
            className="w-full rounded-md border bg-background py-2.5 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* User */}
        <select
          value={userId}
          onChange={(event) => {
            const value = event.target.value;

            setUserId(value ? Number(value) : '');
            setPage(1);
          }}
          aria-label="Filter by user"
          className="w-full rounded-md border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring lg:w-auto"
        >
          <option value="">All users</option>

          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>

        {/* Action */}
        <select
          value={action}
          onChange={(event) => {
            setAction(
              event.target.value as ActivityLogAction | '',
            );
            setPage(1);
          }}
          aria-label="Filter by action"
          className="w-full rounded-md border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring lg:w-auto"
        >
          <option value="">All actions</option>
          <option value="Create">Create</option>
          <option value="Update">Update</option>
          <option value="Delete">Delete</option>
        </select>

        {/* Entity Type */}
        <select
          value={entityType}
          onChange={(event) => {
            setEntityType(
              event.target.value as ActivityLogEntityType | '',
            );
            setPage(1);
          }}
          aria-label="Filter by entity type"
          className="w-full rounded-md border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring lg:w-auto"
        >
          <option value="">All entities</option>
          <option value="User">User</option>
          <option value="Ticket">Ticket</option>
          <option value="Comment">Comment</option>
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
          {descending ? 'Newest first' : 'Oldest first'}
        </button>
      </div>

      {/* Table */}
      <ActivityLogTable logs={logs} />

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {totalItems === 0 ? 0 : (page - 1) * pageSize + 1}–
          {Math.min(page * pageSize, totalItems)} of {totalItems} logs
        </p>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={page === 1 || isLoading}
            onClick={() => setPage((current) => current - 1)}
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
            onClick={() => setPage((current) => current + 1)}
            className="rounded-md border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default ActivityLogsPage;