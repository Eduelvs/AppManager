import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { Background } from '@/components/Background';
import { BarChart, buildBarData } from '@/components/BarChart';
import { GlassCard, PrimaryButton } from '@/components/glass';
import {
  contributedPrincipal,
  formatBRL,
  formatBRLCompact,
  portfolioMonthlyYield,
  portfolioProjected,
  portfolioReal,
  projectedThroughYear,
  realThroughYear,
} from '@/lib/finance';
import { useInvestments } from '@/lib/investment-store';

export default function Dashboard() {
  const router = useRouter();
  const { planList, getPlan } = useInvestments();

  const currentYear = new Date().getFullYear();
  const years = planList.map((p) => p.year);

  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  const effectiveYear = useMemo(() => {
    if (years.includes(selectedYear)) return selectedYear;
    if (years.includes(currentYear)) return currentYear;
    return years[years.length - 1] ?? currentYear;
  }, [years, selectedYear, currentYear]);

  const plan = getPlan(effectiveYear);

  const totalProjected = portfolioProjected(planList);
  const totalReal = portfolioReal(planList);
  const monthlyYield = portfolioMonthlyYield(planList);
  const progress = totalProjected > 0 ? Math.min(1, totalReal / totalProjected) : 0;

  const chartData = plan
    ? buildBarData(
        Array.from({ length: 12 }, () => plan.monthlyContribution),
        Array.from({ length: 12 }, (_, m) => plan.actuals[m] ?? 0),
      )
    : buildBarData([], []);

  return (
    <View className="flex-1 bg-black">
      <StatusBar style="light" />
      <Background />

      <SafeAreaView className="flex-1" edges={['top']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerClassName="px-6 pt-4 pb-32">
          {/* Cabeçalho */}
          <Animated.View entering={FadeInUp.springify()} className="mb-6">
            <Text className="text-[13px] font-semibold uppercase tracking-widest text-[#a1a1aa]">
              Meu Plano
            </Text>
            <Text className="mt-1 text-3xl font-bold text-white">Investimentos</Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(60).springify()} className="mb-4 flex-col gap-3">
            <View className="flex-row gap-3">
            <GlassCard className="flex-1 p-4">
              <View className="mb-2 flex-row items-center gap-2">
                <Ionicons name="trending-up-outline" size={16} color="#c084fc" />
                <Text className="text-[12px] font-medium text-[#a1a1aa]">Projetado</Text>
              </View>
              <Text className="text-xl font-bold text-white" numberOfLines={1} adjustsFontSizeToFit>
                {formatBRL(totalProjected)}
              </Text>
            </GlassCard>

            <GlassCard className="flex-1 p-4">
              <View className="mb-2 flex-row items-center gap-2">
                <Ionicons name="wallet-outline" size={16} color="#4ade80" />
                <Text className="text-[12px] font-medium text-[#a1a1aa]">Real</Text>
              </View>
              <Text className="text-xl font-bold text-white" numberOfLines={1} adjustsFontSizeToFit>
                {formatBRL(totalReal)}
              </Text>
            </GlassCard>
            </View>
            <View className="flex gap-3">
            <GlassCard className="flex-1 p-4">
              <View className="mb-2 flex-row items-center gap-2">
                <Ionicons name="trending-up-outline" size={16} color="#c084fc" />
                <Text className="text-[12px] font-medium text-[#a1a1aa]">Rentabilidade Mensal</Text>
              </View>
              <Text className="text-xl font-bold text-white" numberOfLines={1} adjustsFontSizeToFit>
                {formatBRL(monthlyYield)}
              </Text>
            </GlassCard>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(100).springify()}>
            <GlassCard className="mb-6 p-4">
              <View className="mb-2 flex-row items-center justify-between">
                <Text className="text-[13px] text-[#c9c9cf]">Real vs. projetado</Text>
                <Text className="text-[13px] font-semibold text-[#c084fc]">
                  {Math.round(progress * 100)}%
                </Text>
              </View>
              <View className="h-2 overflow-hidden rounded-full bg-[rgba(255,255,255,0.08)]">
                <View
                  className="h-full rounded-full bg-[#a855f7]"
                  style={{ width: `${Math.max(2, progress * 100)}%` }}
                />
              </View>
            </GlassCard>
          </Animated.View>

          {/* Seletor de ano */}
          {years.length > 0 && (
            <Animated.View entering={FadeInUp.delay(140).springify()} className="mb-4">
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerClassName="gap-2">
                {years.map((year) => {
                  const active = year === effectiveYear;
                  return (
                    <Pressable
                      key={year}
                      onPress={() => setSelectedYear(year)}
                      className={`rounded-full border px-4 py-2 ${
                        active
                          ? 'border-[#d1a0f2] bg-[rgba(168,85,247,0.2)]'
                          : 'border-[rgba(255,255,255,0.14)]'
                      }`}>
                      <Text
                        className={`text-[14px] font-semibold ${
                          active ? 'text-white' : 'text-[#a1a1aa]'
                        }`}>
                        {year}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </Animated.View>
          )}

          {plan ? (
            <Animated.View entering={FadeInUp.delay(180).springify()}>
              <GlassCard className="mb-6 p-5">
                <View className="mb-4 flex-row items-center justify-between">
                  <Text className="text-lg font-bold text-white">Projeção {effectiveYear}</Text>
                  <Text className="text-[12px] text-[#71717a]">{plan.annualRate}% a.a.</Text>
                </View>

                <BarChart data={chartData} />

                <View className="mt-5 flex-row justify-between border-t border-[rgba(255,255,255,0.08)] pt-4">
                  <View>
                    <Text className="text-[12px] text-[#a1a1aa]">Projetado até {effectiveYear}</Text>
                    <Text className="mt-0.5 text-base font-bold text-white">
                      {formatBRLCompact(projectedThroughYear(planList, effectiveYear))}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-[12px] text-[#a1a1aa]">Real até {effectiveYear}</Text>
                    <Text className="mt-0.5 text-base font-bold text-white">
                      {formatBRLCompact(realThroughYear(planList, effectiveYear))}
                    </Text>
                  </View>
                </View>
              </GlassCard>
            </Animated.View>
          ) : (
            <Animated.View entering={FadeInUp.delay(180).springify()}>
              <GlassCard className="mb-6 items-center p-8">
                <Ionicons name="bar-chart-outline" size={40} color="#71717a" />
                <Text className="mt-3 text-center text-base font-semibold text-white">
                  Nenhum ano configurado
                </Text>
                <Text className="mt-1 text-center text-[13px] text-[#a1a1aa]">
                  Configure um ano com aporte mensal e taxa de juros para ver a projeção.
                </Text>
                <PrimaryButton
                  label="Configurar plano"
                  onPress={() => router.push('/settings')}
                  className="mt-5 w-full"
                />
              </GlassCard>
            </Animated.View>
          )}

          {plan && (
            <Animated.View entering={FadeInUp.delay(220).springify()}>
              <Pressable
                onPress={() =>
                  router.push({ pathname: '/aporte', params: { year: String(effectiveYear) } })
                }>
                {({ pressed }) => (
                  <GlassCard
                    className={`flex-row items-center gap-4 p-4 ${pressed ? 'opacity-80' : ''}`}>
                    <View className="h-11 w-11 items-center justify-center rounded-full bg-[rgba(168,85,247,0.2)]">
                      <Ionicons name="add" size={24} color="#c084fc" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-[15px] font-semibold text-white">
                        Registrar aporte do mês
                      </Text>
                      <Text className="text-[13px] text-[#a1a1aa]">
                        Aportado em {effectiveYear}: {formatBRL(contributedPrincipal(plan))}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#71717a" />
                  </GlassCard>
                )}
              </Pressable>
            </Animated.View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
