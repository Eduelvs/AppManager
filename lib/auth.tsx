import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQueryClient } from '@tanstack/react-query';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { loginRequest, meRequest, registerRequest } from '@/lib/api/auth';
import { configureApi } from '@/lib/api/client';
import type { ApiUser } from '@/lib/api/types';

const TOKEN_KEY = '@meu-app/auth-token';

type AuthContextValue = {
  hydrated: boolean;
  token: string | null;
  user: ApiUser | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [hydrated, setHydrated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<ApiUser | null>(null);
  const tokenRef = useRef<string | null>(null);

  const logout = useCallback(async () => {
    tokenRef.current = null;
    setToken(null);
    setUser(null);
    queryClient.clear();
    await AsyncStorage.removeItem(TOKEN_KEY);
  }, [queryClient]);

  useEffect(() => {
    configureApi({
      getToken: () => tokenRef.current,
      onUnauthorized: () => {
        void logout();
      },
    });
  }, [logout]);

  useEffect(() => {
    let active = true;
    configureApi({
      getToken: () => tokenRef.current,
      onUnauthorized: () => {
        void logout();
      },
    });
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(TOKEN_KEY);
        if (!active) return;
        if (!stored) return;
        tokenRef.current = stored;
        setToken(stored);
        const me = await meRequest();
        if (!active) return;
        setUser(me);
      } catch {
        if (active) {
          tokenRef.current = null;
          setToken(null);
          setUser(null);
          await AsyncStorage.removeItem(TOKEN_KEY);
        }
      } finally {
        if (active) setHydrated(true);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const applySession = useCallback(
    async (accessToken: string, nextUser: ApiUser) => {
      tokenRef.current = accessToken;
      setToken(accessToken);
      setUser(nextUser);
      await AsyncStorage.setItem(TOKEN_KEY, accessToken);
      await queryClient.invalidateQueries({ queryKey: ['planos'] });
    },
    [queryClient],
  );

  const login = useCallback(
    async (email: string, password: string) => {
      const result = await loginRequest(email.trim().toLowerCase(), password);
      await applySession(result.access_token, result.user);
    },
    [applySession],
  );

  const register = useCallback(
    async (email: string, password: string) => {
      const result = await registerRequest(email.trim().toLowerCase(), password);
      await applySession(result.access_token, result.user);
    },
    [applySession],
  );

  const value = useMemo<AuthContextValue>(
    () => ({ hydrated, token, user, login, register, logout }),
    [hydrated, token, user, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>.');
  return ctx;
}
