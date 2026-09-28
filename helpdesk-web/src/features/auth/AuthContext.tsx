import { createContext, useEffect, useState, type ReactNode } from 'react';

import {
  clearStoredAuth,
  getStoredAuth,
  saveAuth,
} from './authStorage';

import { logout as logoutApi } from './api/authApi';

import type { AuthResponse } from './types';

import {
  setAuthRefreshedHandler,
  setUnauthorizedHandler,
} from '../../lib/api';

interface AuthContextValue {
  auth: AuthResponse | null;
  isAuthenticated: boolean;
  login: (auth: AuthResponse) => void;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [auth, setAuth] =
    useState<AuthResponse | null>(getStoredAuth);

  useEffect(() => {
    setAuthRefreshedHandler((authResponse) => {
      setAuth(authResponse);
    });

    setUnauthorizedHandler(() => {
      setAuth((currentAuth) => {
        if (currentAuth) {
          clearStoredAuth();
          return null;
        }

        return currentAuth;
      });
    });
  }, []);

  function login(authResponse: AuthResponse) {
    saveAuth(authResponse);
    setAuth(authResponse);
  }

  async function logout() {
    try {
      await logoutApi();
    } finally {
      clearStoredAuth();
      setAuth(null);
    }
  }

  const isAuthenticated = auth !== null;

  return (
    <AuthContext.Provider
      value={{
        auth,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}