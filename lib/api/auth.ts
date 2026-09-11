import { api } from './client';
import type { AuthResponse, ApiUser } from './types';

export function loginRequest(email: string, password: string) {
  return api.post<AuthResponse>('/auth/login', { email, password });
}

export function registerRequest(email: string, password: string) {
  return api.post<AuthResponse>('/auth/register', { email, password });
}

export function meRequest() {
  return api.get<ApiUser>('/auth/me');
}
