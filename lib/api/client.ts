import { getApiUrl } from './config';

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

type TokenStore = {
  getToken: () => string | null;
  onUnauthorized?: () => void;
};

const tokenStore: TokenStore = {
  getToken: () => null,
};

export function configureApi(options: TokenStore) {
  tokenStore.getToken = options.getToken;
  tokenStore.onUnauthorized = options.onUnauthorized;
}

function parseMessage(payload: unknown, fallback: string): string {
  if (!payload || typeof payload !== 'object') return fallback;
  const message = (payload as { message?: unknown }).message;
  if (typeof message === 'string' && message.trim()) return message;
  if (Array.isArray(message)) {
    const joined = message.filter((item) => typeof item === 'string').join('\n');
    if (joined) return joined;
  }
  return fallback;
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (!headers.has('Content-Type') && init.body) {
    headers.set('Content-Type', 'application/json');
  }

  const token = tokenStore.getToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);

  let response: Response;
  try {
    response = await fetch(`${getApiUrl()}${path}`, {
      ...init,
      headers,
    });
  } catch {
    throw new ApiError(0, 'Não foi possível conectar ao servidor.');
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  let payload: unknown = null;
  if (text) {
    try {
      payload = JSON.parse(text) as unknown;
    } catch {
      payload = { message: text };
    }
  }

  if (!response.ok) {
    const isAuthForm = path.startsWith('/auth/login') || path.startsWith('/auth/register');
    if (response.status === 401 && !isAuthForm) {
      tokenStore.onUnauthorized?.();
    }
    throw new ApiError(response.status, parseMessage(payload, 'Não foi possível concluir a requisição.'));
  }

  return payload as T;
}

export const api = {
  get: <T>(path: string) => apiFetch<T>(path),
  post: <T>(path: string, body?: unknown) =>
    apiFetch<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  patch: <T>(path: string, body?: unknown) =>
    apiFetch<T>(path, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined }),
  delete: (path: string) => apiFetch<void>(path, { method: 'DELETE' }),
};
