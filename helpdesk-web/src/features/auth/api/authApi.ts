import { apiFetch } from '../../../lib/api';
import type { LoginRequest, AuthResponse } from '../types';

export function login(request: LoginRequest) {
  return apiFetch<AuthResponse>('/Auth/login', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

export function refresh() {
  return apiFetch<AuthResponse>('/Auth/refresh', {
    method: 'POST',
  });
}

export function logout() {
  return apiFetch<{ message: string }>('/Auth/logout', {
    method: 'POST',
  });
}
