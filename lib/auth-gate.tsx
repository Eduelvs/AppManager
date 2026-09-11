import { useRouter, useSegments } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { useAuth } from '@/lib/auth';

const PUBLIC_ROUTES = new Set(['index', 'intro', 'login', 'signIn']);

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { hydrated, token } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!hydrated) return;
    const root = typeof segments[0] === 'string' ? segments[0] : 'index';
    const isPublic = PUBLIC_ROUTES.has(root);

    if (!token && !isPublic) {
      router.replace('/login');
      return;
    }

    if (token && (root === 'login' || root === 'signIn' || root === 'intro')) {
      router.replace('/dashboard');
    }
  }, [hydrated, token, segments, router]);

  if (!hydrated) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator color="#c084fc" />
      </View>
    );
  }

  return <>{children}</>;
}
