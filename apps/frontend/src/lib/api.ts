import { useAuthStore } from '../store/useAuthStore';

export const apiFetch = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const token = typeof window !== 'undefined' ? useAuthStore.getState().accessToken : null;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(options.headers || {}),
  };

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  const response = await fetch(cleanEndpoint, {
    ...options,
    headers,
  });

  if (response.ok) {
    if (response.status === 204) return {} as T;
    return await response.json();
  }

  if (response.status === 401 && typeof window !== 'undefined') {
    useAuthStore.getState().logout();
  }

  let errorMessage = 'An error occurred';
  try {
    const errorData = await response.json();
    errorMessage = errorData.error || errorData.message || errorMessage;
  } catch (e) {
    errorMessage = response.statusText;
  }

  throw new Error(errorMessage);
};
