export type ActivityLogAction =
  | 'Create'
  | 'Update'
  | 'Delete';

export type ActivityLogEntityType =
  | 'User'
  | 'Ticket'
  | 'Comment';

export interface ActivityLogQueryRequest {
  page?: number;
  pageSize?: number;
  search?: string;
  action?: ActivityLogAction;
  entityType?: ActivityLogEntityType;
  userId?: number;
  descending?: boolean;
}

export interface ActivityLogResponse {
  id: number;
  userId: number | null;
  userName: string | null;
  action: string;
  entityType: string;
  entityId: number;
  description: string | null;
  createdAt: string;
}

export interface PagedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}