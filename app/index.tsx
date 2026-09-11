import { Redirect } from 'expo-router';

import { useAuth } from '@/lib/auth';

export default function Index() {
  const { hydrated, token } = useAuth();

  if (!hydrated) return null;
  if (token) return <Redirect href="/dashboard" />;
  return <Redirect href="/intro" />;
}
