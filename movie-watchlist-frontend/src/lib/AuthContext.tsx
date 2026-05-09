"use client";

// src/lib/AuthContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { authAPI } from "./Api";

type User = {
  id: string;
  email: string;
  username: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (
    first:string,
    last:string,
    email: string,
    username: string,
    password: string
  ) => Promise<any>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // On mount: check if token exists and verify it
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      authAPI
        .me()
        .then((u: User) => setUser(u))
        .catch(() => {
          // Token invalid/expired - clear it
          localStorage.removeItem("token");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const data = await authAPI.login(email, password);

    localStorage.setItem("token", data.token);
    setUser(data.user);

    return data;
  };

  const register = async (
    first: string,
    last: string,
    email: string,
    username: string,
    password: string
  ) => {
    const data = await authAPI.register(first, last, email, username, password);

    localStorage.setItem("token", data.token);
    setUser(data.user);

    return data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return ctx;
};