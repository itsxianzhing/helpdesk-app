import { useEffect, useState } from "react";
import {
  Ticket,
  CircleDot,
  Clock3,
  CheckCircle2,
  CircleCheckBig,
} from "lucide-react";
import { getTickets } from "../../tickets/api/ticketApi";
import type { TicketListResponse } from "../../tickets/types";
import { ApiError } from "../../../lib/apiError";
import { useAuth } from "../../auth/hooks/useAuth";
import StatCard from "../components/StatCard";
import RecentTickets from "../components/RecentTickets";
import QuickActions from "../components/QuickActions";

function DashboardPage() {
  const { auth } = useAuth();

  const [tickets, setTickets] =
    useState<TicketListResponse[]>([]);

  const [totalTickets, setTotalTickets] =
    useState(0);

  const [openTickets, setOpenTickets] =
    useState(0);

  const [inProgressTickets, setInProgressTickets] =
    useState(0);

  const [resolvedTickets, setResolvedTickets] =
    useState(0);

  const [closedTickets, setClosedTickets] =
    useState(0);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboard() {
      setIsLoading(true);
      setError(null);

      try {
        const [
          totalResponse,
          openResponse,
          inProgressResponse,
          resolvedResponse,
          closedResponse,
          recentResponse,
        ] = await Promise.all([
          getTickets({
            page: 1,
            pageSize: 1,
          }),

          getTickets({
            page: 1,
            pageSize: 1,
            status: "Open",
          }),

          getTickets({
            page: 1,
            pageSize: 1,
            status: "InProgress",
          }),

          getTickets({
            page: 1,
            pageSize: 1,
            status: "Resolved",
          }),

          getTickets({
            page: 1,
            pageSize: 1,
            status: "Closed",
          }),

          getTickets({
            page: 1,
            pageSize: 5,
            sortBy: "CreatedAt",
            descending: true,
          }),
        ]);

        setTotalTickets(
          totalResponse.totalItems,
        );

        setOpenTickets(
          openResponse.totalItems,
        );

        setInProgressTickets(
          inProgressResponse.totalItems,
        );

        setResolvedTickets(
          resolvedResponse.totalItems,
        );

        setClosedTickets(
          closedResponse.totalItems,
        );

        setTickets(recentResponse.items);
      } catch (error) {
        if (error instanceof ApiError) {
          setError(error.message);
        } else {
          setError(
            "Failed to load dashboard.",
          );
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Loading your dashboard...
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-28 animate-pulse rounded-xl border bg-card"
            />
          ))}
        </div>

        <div className="h-40 animate-pulse rounded-xl border bg-card" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Welcome back, {auth?.name}.
          </p>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <p className="font-medium">
            Unable to load dashboard
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Welcome back, {auth?.name}.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          title="Total Tickets"
          value={totalTickets}
          icon={Ticket}
        />

        <StatCard
          title="Open"
          value={openTickets}
          icon={CircleDot}
        />

        <StatCard
          title="In Progress"
          value={inProgressTickets}
          icon={Clock3}
        />

        <StatCard
          title="Resolved"
          value={resolvedTickets}
          icon={CheckCircle2}
        />

        <StatCard
          title="Closed"
          value={closedTickets}
          icon={CircleCheckBig}
        />
      </div>

      <QuickActions />

      <RecentTickets tickets={tickets} />
    </div>
  );
}

export default DashboardPage;