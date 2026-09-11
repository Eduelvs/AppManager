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
            <Stack.Screen name="intro" />
            <Stack.Screen name="signIn" />
            <Stack.Screen name="login" />
            <Stack.Screen name="(layout)" />
            <Stack.Screen
              name="aporte"
              options={{
                presentation: 'formSheet',
                sheetAllowedDetents: [0.55],
                sheetGrabberVisible: true,
                sheetCornerRadius: 28,
                headerShown: false,
                contentStyle: {
                  backgroundColor: '#1c1c1e',
                  height: '100%',
                },
              }}
            />
            <Stack.Screen
              name="plano/[id]"
              options={{
                animation: 'slide_from_right',
                contentStyle: { backgroundColor: '#000' },
              }}
            />
            <Stack.Screen
              name="ano"
              options={{
                presentation: 'formSheet',
                sheetAllowedDetents: [0.62],
                sheetGrabberVisible: true,
                sheetCornerRadius: 28,
                headerShown: false,
                contentStyle: {
                  backgroundColor: '#1c1c1e',
                  height: '100%',
                },
              }}
            />
            <Stack.Screen
              name="plano-nome"
              options={{
                presentation: 'formSheet',
                sheetAllowedDetents: [0.5],
                sheetGrabberVisible: true,
                sheetCornerRadius: 28,
                headerShown: false,
                contentStyle: {
                  backgroundColor: '#1c1c1e',
                  height: '100%',
                },
              }}
            />
          </Stack>
        </InvestmentProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
