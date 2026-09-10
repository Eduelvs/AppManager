import { Stack } from 'expo-router';
import { NativeTabs } from 'expo-router/unstable-native-tabs';

import { useColorScheme } from '@/lib/useColorScheme';

export default function TabLayout() {
  const { colors } = useColorScheme();

  return (
    <>
      <Stack.Screen options={{ title: 'Tabs' }} />
      <NativeTabs
        tintColor={colors.primary}
        iconColor={{ default: colors.grey2, selected: colors.primary }}
        labelStyle={{
          default: { color: colors.grey2 },
          selected: { color: colors.primary },
        }}
        badgeBackgroundColor={colors.destructive}
        badgeTextColor={colors.primaryForeground}
        disableTransparentOnScrollEdge
        minimizeBehavior="onScrollDown">
        <NativeTabs.Trigger name="dashboard">
          <NativeTabs.Trigger.Icon
            sf={{ default: 'chart.bar', selected: 'chart.bar.fill' }}
            md="bar_chart"
          />
          <NativeTabs.Trigger.Label>Dashboard</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="settings">
          <NativeTabs.Trigger.Icon
            sf={{ default: 'gearshape', selected: 'gearshape.fill' }}
            md="settings"
          />
          <NativeTabs.Trigger.Label>Configurações</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
      </NativeTabs>
    </>
  );
}
