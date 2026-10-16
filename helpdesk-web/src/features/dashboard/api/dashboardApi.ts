import { apiFetch } from '../../../lib/api';
import type { TicketListResponse } from '../../tickets/types';

export interface DashboardResponse {
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
  closedTickets: number;
  totalUsers: number | null;
  recentTickets: TicketListResponse[];
}

export function getDashboard() {
  return apiFetch<DashboardResponse>('/dashboard');
}
