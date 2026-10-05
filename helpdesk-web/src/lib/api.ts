import {
  getStoredAuth,
  saveAuth,
} from '../features/auth/authStorage';

import type { AuthResponse } from '../features/auth/types';

import { ApiError } from './apiError';

const API_URL = import.meta.env.VITE_API_URL;

let unauthorizedHandler: (() => void) | null = null;

let authRefreshedHandler:
  ((auth: AuthResponse) => void) | null = null;

let refreshPromise: Promise<AuthResponse> | null = null;

export function setAuthRefreshedHandler(
  handler: (auth: AuthResponse) => void,
) {
  authRefreshedHandler = handler;
}

export function setUnauthorizedHandler(
  handler: () => void,
) {
  unauthorizedHandler = handler;
}

interface ApiFetchOptions extends RequestInit {
  skipRefresh?: boolean;
}

async function refreshAccessToken(): Promise<AuthResponse> {
  if (!refreshPromise) {
    refreshPromise = apiFetch<AuthResponse>(
      '/Auth/refresh',
      {
        method: 'POST',
        skipRefresh: true,
      },
    ).finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

export async function apiFetch<T>(
  endpoint: string,
  options?: ApiFetchOptions,
): Promise<T> {
  const {
    skipRefresh,
    ...fetchOptions
  } = options ?? {};

  const auth = getStoredAuth();

  let response: Response;

  try {
    response = await fetch(
      `${API_URL}${endpoint}`,
      {
        ...fetchOptions,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',

          ...(auth?.token && {
            Authorization: `Bearer ${auth.token}`,
          }),

          ...fetchOptions.headers,
        },
      },
    );
  } catch {
    throw new ApiError(
      'Unable to connect to the server.',
      0,
    );
  }

  const shouldAttemptRefresh =
    response.status === 401 &&
    !skipRefresh &&
    endpoint !== '/Auth/login' &&
    endpoint !== '/Auth/refresh' &&
    endpoint !== '/Auth/logout';

  if (shouldAttemptRefresh) {
    try {
      const refreshResponse =
        await refreshAccessToken();

      saveAuth(refreshResponse);
      authRefreshedHandler?.(refreshResponse);

      return apiFetch<T>(
        endpoint,
        {
          ...fetchOptions,
          skipRefresh: true,
        },
      );
    } catch {
      unauthorizedHandler?.();

      throw new ApiError(
        'Your session has expired.',
        401,
      );
    }
  }

  if (!response.ok) {
    let errorData: {
    message?: string;
    errors?: string[];
    code?: string;
  } = {};

    try {
      errorData = await response.json();
    } catch {
      // Response tidak memiliki JSON body.
    }

    throw new ApiError(
      errorData.message ?? 'Something went wrong.',
      response.status,
      errorData.errors ?? [],
      errorData.code,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}