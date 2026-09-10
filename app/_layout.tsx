import '@/global.css';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { InvestmentProvider } from '@/lib/investment-store';
import { useColorScheme } from '@/lib/useColorScheme';

export default function RootLayout() {
  const { isDarkColorScheme } = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <InvestmentProvider>
          <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="signIn" />
            <Stack.Screen name="(route)" />
            <Stack.Screen
              name="aporte"
              options={{
                presentation: 'modal',
                gestureEnabled: true,
                contentStyle: { backgroundColor: '#0b0b0f' },
              }}
            />
          </Stack>
        </InvestmentProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
