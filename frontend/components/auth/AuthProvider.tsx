"use client";

import * as React from "react";
import type { AuthUser } from "@/types/user.types";
import { getCurrentUser, logout as authLogout } from "@/lib/auth";
import { getToken } from "@/lib/token-storage";

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
  logout: () => void;
}

export const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const refreshUser = React.useCallback(async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    let active = true;
    const run = async () => {
      await Promise.resolve();
      if (!active) return;
      refreshUser();
    };
    run();
    return () => {
      active = false;
    };
  }, [refreshUser]);

  const logout = React.useCallback(() => {
    authLogout();
    setUser(null);
  }, []);

  const value = React.useMemo(() => ({
    user,
    isLoading,
    isAuthenticated: !!user,
    refreshUser,
    logout,
  }), [user, isLoading, refreshUser, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
