import { apiFetch } from '../../../lib/api';
import type { ActivityLogQueryRequest, ActivityLogResponse, PagedResponse } from '../types';

function buildQueryParams(query: ActivityLogQueryRequest): string {
  const params = new URLSearchParams();

  if (query.page !== undefined) {
    params.set('page', String(query.page));
  }

  if (query.pageSize !== undefined) {
    params.set('pageSize', String(query.pageSize));
  }

  if (query.search) {
    params.set('search', query.search);
  }

  if (query.action) {
    params.set('action', query.action);
  }

  if (query.entityType) {
    params.set('entityType', query.entityType);
  }

  if (query.userId !== undefined) {
    params.set('userId', String(query.userId));
  }

  if (query.descending !== undefined) {
    params.set('descending', String(query.descending));
  }

  const queryString = params.toString();

  return queryString ? `?${queryString}` : '';
}

export function getActivityLogs(query: ActivityLogQueryRequest = {}) {
  const queryString = buildQueryParams(query);

  return apiFetch<PagedResponse<ActivityLogResponse>>(`/ActivityLogs${queryString}`);
}
