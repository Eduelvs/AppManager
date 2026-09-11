import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { MONTHS_PT } from '@/lib/finance';

export type BarDatum = {
  label: string;
  projected: number;
  real: number;
};

const CHART_HEIGHT = 112;
const BAR_WIDTH = 18;
const STACK_GAP = 3;

export function BarChart({ data }: { data: BarDatum[] }) {
  const max = Math.max(1, ...data.map((d) => Math.max(d.projected, d.real)));

  return (
    <View>
      <View className="mb-3 flex-row items-center gap-5">
        <View className="flex-row items-center gap-2">
          <View className="h-2.5 w-2.5 rounded-full bg-[#a855f7]" />
          <Text className="text-xs text-muted">Real</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <View className="h-2.5 w-2.5 rounded-full bg-[#ef4444]" />
          <Text className="text-xs text-muted">Pendente</Text>
        </View>
      </View>

      <View className="flex-row items-end gap-1.5 pb-1">
        {data.map((d, index) => {
          const real = Math.max(0, d.real);
          const projected = Math.max(0, d.projected);
          const missing = Math.max(0, projected - real);
          const extra = Math.max(0, real - projected);
          const achieved = Math.min(real, projected);

          const segments = [
            achieved > 0
              ? { key: 'real', value: achieved, colors: ['#c084fc', '#a855f7', '#6b21a8'] as const }
              : null,
            extra > 0
              ? { key: 'extra', value: extra, colors: ['#e9d5ff', '#c084fc'] as const }
              : null,
            missing > 0
              ? { key: 'missing', value: missing, colors: ['#f87171', '#ef4444', '#b91c1c'] as const }
              : null,
          ].filter((s): s is NonNullable<typeof s> => s !== null);

          const gaps = Math.max(0, segments.length - 1) * STACK_GAP;
          const available = Math.max(1, CHART_HEIGHT - gaps);
          const heights = segments.map((s) => (s.value / max) * available);

          return (
            <View key={d.label} className="flex-1 items-center justify-end">
              <View className="w-full items-center justify-end" style={{ height: CHART_HEIGHT }}>
                <Animated.View
                  entering={FadeInUp.delay(index * 45).springify()}
                  className="items-center justify-end"
                  style={{ width: BAR_WIDTH, gap: STACK_GAP }}>
                  {[...segments].reverse().map((segment, i) => (
                    <View
                      key={segment.key}
                      className="overflow-hidden rounded-md"
                      style={{ width: BAR_WIDTH, height: heights[segments.length - 1 - i] }}>
                      <LinearGradient
                        colors={[...segment.colors]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        style={{ flex: 1 }}
                      />
                    </View>
                  ))}
                </Animated.View>
              </View>
              <Text className="mt-3 text-[10px] text-grey2">{d.label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

export function buildBarData(projected: number[], real: number[]): BarDatum[] {
  return MONTHS_PT.map((label, m) => ({
    label,
    projected: projected[m] ?? 0,
    real: real[m] ?? 0,
  }));
}
