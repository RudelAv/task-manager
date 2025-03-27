import { User } from "./types";

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

interface AuthResponse {
  user: User;
  token: string;
}

interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw data as ErrorResponse;
    }

    // Stocker le token dans le localStorage et les cookies
    localStorage.setItem("auth_token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    
    // Ajouter le token aux cookies pour le middleware
    document.cookie = `auth_token=${data.token}; path=/; max-age=2592000`; // 30 jours

    return data as AuthResponse;
  } catch (error) {
    throw error;
  }
}

export async function register(name: string, email: string, password: string, password_confirmation: string): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password, password_confirmation }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw data as ErrorResponse;
    }

    // Stocker le token dans le localStorage et les cookies
    localStorage.setItem("auth_token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    
    // Ajouter le token aux cookies pour le middleware
    document.cookie = `auth_token=${data.token}; path=/; max-age=2592000`; // 30 jours

    return data as AuthResponse;
  } catch (error) {
    throw error;
  }
}

export function logout(): void {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("user");
  
  // Supprimer le cookie
  document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
}

export function getAuthToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token");
  }
  return null;
}

export function getCurrentUser(): User | null {
  if (typeof window !== "undefined") {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      return JSON.parse(userStr) as User;
    }
  }
  return null;
}

export function isAuthenticated(): boolean {
  return !!getAuthToken();
} 