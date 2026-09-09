import { useEffect, useState } from "react";
import { getTickets } from "../api/ticketApi";
import type { TicketListResponse } from "../types";
import { ApiError } from "../../../lib/apiError";
import { Link } from "react-router";
import { Plus, Search } from "lucide-react";
import TicketTable from "../components/TicketTable";
import useDebounce from "../../../hooks/useDebounce";

function TicketsPage() {
  const [tickets, setTickets] = useState<
    TicketListResponse[]
  >([]);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");

  const [sortBy, setSortBy] = useState("CreatedAt");
  const [descending, setDescending] = useState(true);

  const debouncedSearch = useDebounce(
    search,
    500,
  );

  const [totalItems, setTotalItems] =
    useState(0);

  const [totalPages, setTotalPages] =
    useState(0);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    async function fetchTickets() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getTickets({
          page,
          pageSize,
          search: debouncedSearch || undefined,
          status: status || undefined,
          priority: priority || undefined,
          sortBy: sortBy || undefined,
          descending,
        });

        setTickets(response.items);
        setTotalItems(response.totalItems);
        setTotalPages(response.totalPages);
      } catch (error) {
        if (error instanceof ApiError) {
          setError(error.message);
        } else {
          setError("Failed to load tickets.");
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchTickets();
  }, [
    page,
    pageSize,
    debouncedSearch,
    status,
    priority,
    sortBy,
    descending,
  ]);

  if (isLoading) {
    return (
      <div className="p-6">
        <p className="text-sm text-muted-foreground">
          Loading tickets...
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Tickets
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage your support requests.
          </p>
        </div>

        <Link
          to="/tickets/new"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          <Plus size={18} />
          New Ticket
        </Link>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-2 gap-3 lg:flex">
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
            placeholder="Search tickets..."
            className="w-full rounded-md border bg-background py-2.5 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <select
          value={status}
          onChange={(event) => {
            setStatus(event.target.value);
            setPage(1);
          }}
          className="w-full rounded-md border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring lg:w-auto"
        >
          <option value="">
            All statuses
          </option>
          <option value="Open">Open</option>
          <option value="InProgress">
            In Progress
          </option>
          <option value="Resolved">
            Resolved
          </option>
          <option value="Closed">
            Closed
          </option>
        </select>

        <select
          value={priority}
          onChange={(event) => {
            setPriority(event.target.value);
            setPage(1);
          }}
          className="w-full rounded-md border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring lg:w-auto"
        >
          <option value="">
            All priorities
          </option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Critical">
            Critical
          </option>
        </select>

        <select
          value={sortBy}
          onChange={(event) => {
            setSortBy(event.target.value);
            setPage(1);
          }}
          className="w-full rounded-md border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring lg:w-auto"
        >
          <option value="CreatedAt">
            Created At
          </option>

          <option value="Title">
            Title
          </option>

          <option value="Priority">
            Priority
          </option>

          <option value="Status">
            Status
          </option>
        </select>

        <button
          type="button"
          onClick={() => {
            setDescending((current) => !current);
            setPage(1);
          }}
          className="w-full rounded-md border px-3 py-2.5 text-sm hover:bg-muted lg:w-auto"
        >
          {descending
            ? "Descending"
            : "Ascending"}
        </button>
      </div>

      {/* Table */}
      <TicketTable
        tickets={tickets}
        detailPath={(id) => `/tickets/${id}`}
      />

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
          of {totalItems} tickets
        </p>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={page === 1 || isLoading}
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

export default TicketsPage;