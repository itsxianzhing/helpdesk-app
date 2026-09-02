import { apiFetch } from "../../../lib/api";
import type {
  PagedResponse,
  UserQueryRequest,
  UserResponse,
} from "../types";

function buildQueryParams(
  query: UserQueryRequest,
): string {
  const params = new URLSearchParams();

  if (query.page !== undefined) {
    params.set(
      "page",
      String(query.page),
    );
  }

  if (query.pageSize !== undefined) {
    params.set(
      "pageSize",
      String(query.pageSize),
    );
  }

  if (query.search) {
    params.set(
      "search",
      query.search,
    );
  }

  if (query.role) {
    params.set(
      "role",
      query.role,
    );
  }

  if (query.status) {
    params.set(
      "status",
      query.status,
    );
  }

  if (query.sortBy) {
    params.set(
      "sortBy",
      query.sortBy,
    );
  }

  if (query.descending !== undefined) {
    params.set(
      "descending",
      String(query.descending),
    );
  }

  const queryString = params.toString();

  return queryString
    ? `?${queryString}`
    : "";
}

export function getUsers(
  query: UserQueryRequest = {},
) {
  const queryString =
    buildQueryParams(query);

  return apiFetch<
    PagedResponse<UserResponse>
  >(`/users${queryString}`);
}