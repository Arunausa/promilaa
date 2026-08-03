import { useAuthStore } from '../store/useAuthStore';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

interface FetchOptions extends RequestInit {
  data?: any;
}

export const apiFetch = async <T>(endpoint: string, options: FetchOptions = {}): Promise<T> => {
  const { data, headers: customHeaders, ...customOptions } = options;
  const token = useAuthStore.getState().accessToken;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...customHeaders,
  };

  const config: RequestInit = {
    method: data ? 'POST' : 'GET',
    body: data ? JSON.stringify(data) : undefined,
    headers,
    ...customOptions,
  };

  // Ensure clean URL without duplicate /api/api prefixes
  const baseUrl = API_BASE_URL.replace(/\/api\/?$/, '');
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const finalEndpoint = cleanEndpoint.startsWith('/api/') ? cleanEndpoint : `/api${cleanEndpoint}`;
  const url = `${baseUrl}${finalEndpoint}`;

  const response = await fetch(url, config);

  if (response.ok) {
    if (response.status === 204) {
      return {} as T;
    }
    return await response.json();
  }

  // Handle errors
  if (response.status === 401) {
    // Optionally trigger a token refresh here or force logout
    useAuthStore.getState().logout();
  }

  let errorMessage = 'An error occurred';
  try {
    const errorData = await response.json();
    errorMessage = errorData.message || errorMessage;
  } catch (e) {
    errorMessage = response.statusText;
  }

  throw new Error(errorMessage);
};
