import '@/global.css';

import { Stack } from 'expo-router';
import * as SystemUI from 'expo-system-ui';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider } from '@/lib/auth';
import { AuthGate } from '@/lib/auth-gate';
import { InvestmentProvider } from '@/lib/investment-store';
import { AppQueryProvider } from '@/lib/query';
import { useColorScheme, useSyncSystemColorScheme } from '@/lib/useColorScheme';

export default function RootLayout() {
  const { isDarkColorScheme, colors } = useColorScheme();
  useSyncSystemColorScheme();

  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(colors.root);
  }, [colors.root]);

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.root }}>
      <SafeAreaProvider>
        <AppQueryProvider>
          <AuthProvider>
            <InvestmentProvider>
              <AuthGate>
                <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
                <Stack
                  screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: colors.root },
                  }}>
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
                        backgroundColor: colors.sheet,
                        height: '100%',
                      },
                    }}
                  />
                  <Stack.Screen
                    name="plano/[id]"
                    options={{
                      animation: 'slide_from_right',
                      contentStyle: { backgroundColor: colors.root },
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
                        backgroundColor: colors.sheet,
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
                        backgroundColor: colors.sheet,
                        height: '100%',
                      },
                    }}
                  />
                </Stack>
              </AuthGate>
            </InvestmentProvider>
          </AuthProvider>
        </AppQueryProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
