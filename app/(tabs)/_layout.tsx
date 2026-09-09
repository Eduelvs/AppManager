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
        <NativeTabs.Trigger name="index">
          <NativeTabs.Trigger.Icon sf="newspaper" md="newspaper" />
          <NativeTabs.Trigger.Label>News</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Badge>3</NativeTabs.Trigger.Badge>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="for-you">
          <NativeTabs.Trigger.Icon
            sf={{ default: 'star', selected: 'star.fill' }}
            md={{ default: 'star_border', selected: 'star' }}
          />
          <NativeTabs.Trigger.Label>For You</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
      </NativeTabs>
    </>
  );
}
