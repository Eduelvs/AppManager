import Constants from 'expo-constants';
import { Platform } from 'react-native';

export function getApiUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '');
  if (fromEnv) return fromEnv;

  const extra = Constants.expoConfig?.extra?.apiUrl;
  if (typeof extra === 'string' && extra.trim()) {
    return extra.replace(/\/$/, '');
  }

  const host = Constants.expoConfig?.hostUri?.split(':')[0];
  if (host) {
    if (host === 'localhost' || host === '127.0.0.1') {
      return Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';
    }
    return `http://${host}:3000`;
  }

  return Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';
}
