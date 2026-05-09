// src/lib/api.tsx
// Centralized API client - all backend calls go through here

type User = {
  id: string;
  email: string;
  username: string;
};

type AuthResponse = {
  token: string;
  user: User;
};

export type Movie = {
  id: string;
  title: string;
  poster_path?: string;
  status?: string;
  rating?: number;
  notes?: string;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// ─── HELPERS ──────────────────────────────────────────────

// Get token from localStorage
const getToken = (): string | null => {
  if (typeof window === "undefined") return null;

  return localStorage.getItem("token");
};

// Base fetch with auth header automatically attached
const apiFetch = async <T,>(
  path: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getToken();

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options.headers || {}),
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Something went wrong");
  }

  return data as T;
};

// ─── AUTH ─────────────────────────────────────────────────

export const authAPI = {
  register: (
    first:string,
    last:string,
    email: string,
    username: string,
    password: string
  ): Promise<AuthResponse> =>
    apiFetch<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        first,
        last,
        email,
        username,
        password,
      }),
    }),

  login: (
    email: string,
    password: string
  ): Promise<AuthResponse> =>
    apiFetch<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
    }),

  me: (): Promise<User> =>
    apiFetch<User>("/auth/me"),
};

// ─── MOVIES (CRUD) ────────────────────────────────────────

export const moviesAPI = {
  // Get all movies, optionally filtered by status
  getAll: (
    status?: string,
    sort?: string
  ): Promise<Movie[]> => {
    const params = new URLSearchParams();

    if (status) params.append("status", status);
    if (sort) params.append("sort", sort);

    return apiFetch<Movie[]>(`/movies?${params.toString()}`);
  },

  // Get single movie by DB id
  getOne: (id: string): Promise<Movie> =>
    apiFetch<Movie>(`/movies/${id}`),

  // Add a movie from TMDB to watchlist
  add: (
    movieData: Partial<Movie>
  ): Promise<Movie> =>
    apiFetch<Movie>("/movies", {
      method: "POST",
      body: JSON.stringify(movieData),
    }),

  // Update status, rating, or notes
  update: (
    id: string,
    updates: Partial<Movie>
  ): Promise<Movie> =>
    apiFetch<Movie>(`/movies/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    }),

  // Remove from watchlist
  remove: (id: string): Promise<{ message: string }> =>
    apiFetch<{ message: string }>(`/movies/${id}`, {
      method: "DELETE",
    }),

  // Get stats summary
  stats: (): Promise<any> =>
    apiFetch<any>("/movies/stats/summary"),
};

// ─── TMDB (via backend proxy) ─────────────────────────────

export const tmdbAPI = {
  search: (
    query: string,
    page: number = 1
  ): Promise<any> =>
    apiFetch<any>(
      `/tmdb/search?q=${encodeURIComponent(query)}&page=${page}`
    ),

  getMovie: (
    tmdbId: string
  ): Promise<any> =>
    apiFetch<any>(`/tmdb/movie/${tmdbId}`),

  trending: (
    timeWindow: "day" | "week" = "week"
  ): Promise<any> =>
    apiFetch<any>(
      `/tmdb/trending?window=${timeWindow}`
    ),

  nowPlaying: (): Promise<any> =>
    apiFetch<any>("/tmdb/now-playing"),

  topRated: (): Promise<any> =>
    apiFetch<any>("/tmdb/top-rated"),

  genres: (): Promise<any> =>
    apiFetch<any>("/tmdb/genres"),
};

// ─── IMAGE HELPER ─────────────────────────────────────────

export const tmdbImage = (
  path: string | null,
  size: string = "w500"
): string => {
  if (!path) {
    return "/placeholder-poster.jpg";
  }

  return `${
    process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE ||
    "https://image.tmdb.org/t/p"
  }/${size}${path}`;
};