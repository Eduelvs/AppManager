import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInUp } from 'react-native-reanimated';
import AnimatedGlow, { type PresetConfig } from 'react-native-animated-glow';

import { Background } from '@/components/Background';
import { BarChart, buildBarData } from '@/components/BarChart';
import { PlanPicker } from '@/components/PlanPicker';
import { GlassCard, PrimaryButton } from '@/components/glass';
import {
  contributedPrincipal,
  formatBRL,
  formatBRLCompact,
  MONTHS_PT_FULL,
  portfolioMonthlyYield,
  portfolioProjected,
  portfolioReal,
  projectedThroughYear,
  realThroughYear,
} from '@/lib/finance';
import { useInvestments } from '@/lib/investment-store';
import { useColorScheme } from '@/lib/useColorScheme';

const aporteCtaGlow: PresetConfig = {
  metadata: {
    name: 'Aporte CTA',
    textColor: '#FFFFFF',
    category: 'Custom',
    tags: ['purple', 'cta'],
  },
  states: [
    {
      name: 'default',
      preset: {
        cornerRadius: 22,
        outlineWidth: 1.5,
        borderColor: '#e9d5ff',
        animationSpeed: 0,
        borderSpeedMultiplier: 0,
        glowLayers: [
          {
            glowPlacement: 'behind',
            colors: ['#c084fc', '#a855f7', '#7c3aed'],
            glowSize: 16,
            opacity: 0.3,
            speedMultiplier: 0,
            coverage: 1,
          },
          {
            glowPlacement: 'behind',
            colors: ['#f5d0fe'],
            glowSize: 5,
            opacity: 0.2,
            speedMultiplier: 0,
            coverage: 1,
          },
        ],
      },
    },
  ],
};

export default function Dashboard() {
  const router = useRouter();
  const { goals, activeGoal, activeGoalId, planList, getPlan, setActiveGoalId, isLoading } =
    useInvestments();
  const { colors, isDarkColorScheme } = useColorScheme();
  const [pickerOpen, setPickerOpen] = useState(false);

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

  const goToSettings = () => router.push('/settings');
  const goToCreatePlan = () => router.push('/plano-nome');

  return (
    <View className="flex-1 bg-background">
      <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
      <Background />

      <SafeAreaView className="flex-1" edges={['top']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerClassName="px-6 pt-4 pb-32">
          <Animated.View entering={FadeInUp.springify()} className="mb-6">
            <Pressable
              onPress={() => setPickerOpen(true)}
              className="mb-2 flex-row items-center gap-1.5 self-start rounded-full border border-black/10 px-3 py-1.5 dark:border-white/14">
              <Ionicons name="flag-outline" size={12} color="#c084fc" />
              <Text className="max-w-[220px] text-[13px] font-semibold text-foreground" numberOfLines={1}>
                {activeGoal?.name ?? 'Escolher objetivo'}
              </Text>
              <Ionicons name="chevron-down" size={14} color={colors.muted} />
            </Pressable>
            <Text className="text-3xl font-bold text-foreground">Investimentos</Text>
          </Animated.View>

          {!activeGoal && isLoading ? (
            <View className="items-center py-16">
              <ActivityIndicator color="#c084fc" />
            </View>
          ) : !activeGoal ? (
            <Animated.View entering={FadeInUp.delay(60).springify()}>
              <GlassCard className="mb-6 items-center p-8">
                <Ionicons name="flag-outline" size={40} color={colors.grey2} />
                <Text className="mt-3 text-center text-base font-semibold text-foreground">
                  Nenhum plano criado
                </Text>
                <Text className="mt-1 text-center text-[13px] text-muted">
                  Crie um objetivo nas configurações para acompanhar aportes e projeções.
                </Text>
                <PrimaryButton
                  label="Criar plano"
                  onPress={goToSettings}
                  className="mt-5 w-full"
                />
              </GlassCard>
            </Animated.View>
          ) : (
            <>
              <Animated.View entering={FadeInUp.delay(60).springify()} className="mb-4 flex-col gap-3">
                <View className="flex-row gap-3">
                  <GlassCard className="flex-1 p-4">
                    <View className="mb-2 flex-row items-center gap-2">
                      <Ionicons name="trending-up-outline" size={16} color="#c084fc" />
                      <Text className="text-[12px] font-medium text-muted">Projetado</Text>
                    </View>
                    <Text
                      className="text-xl font-bold text-foreground"
                      numberOfLines={1}
                      adjustsFontSizeToFit>
                      {formatBRL(totalProjected)}
                    </Text>
                  </GlassCard>

                  <GlassCard className="flex-1 p-4">
                    <View className="mb-2 flex-row items-center gap-2">
                      <Ionicons name="wallet-outline" size={16} color="#4ade80" />
                      <Text className="text-[12px] font-medium text-muted">Real</Text>
                    </View>
                    <Text
                      className="text-xl font-bold text-foreground"
                      numberOfLines={1}
                      adjustsFontSizeToFit>
                      {formatBRL(totalReal)}
                    </Text>
                  </GlassCard>
                </View>
                {monthlyYield > 0 && (
                <View className="flex gap-3">
                  <GlassCard className="flex-1 p-4">
                    <View className="mb-2 flex-row items-center gap-2">
                      <Ionicons name="trending-up-outline" size={16} color="#c084fc" />
                      <Text className="text-[12px] font-medium text-muted">
                        Rentabilidade Mensal
                      </Text>
                    </View>
                    <Text
                      className="text-xl font-bold text-foreground"
                      numberOfLines={1}
                      adjustsFontSizeToFit>
                      {formatBRL(monthlyYield)}
                    </Text>
                  </GlassCard>
                </View>
                )}  
              </Animated.View>

              <Animated.View entering={FadeInUp.delay(100).springify()}>
                <GlassCard className="mb-6 p-4">
                  <View className="mb-2 flex-row items-center justify-between">
                    <Text className="text-[13px] text-muted">Real vs. projetado</Text>
                    <Text className="text-[13px] font-semibold text-[#c084fc]">
                      {Math.round(progress * 100)}%
                    </Text>
                  </View>
                  <View className="h-2 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
                    <View
                      className="h-full rounded-full bg-[#a855f7]"
                      style={{ width: `${Math.max(2, progress * 100)}%` }}
                    />
                  </View>
                </GlassCard>
              </Animated.View>

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
                              : 'border-black/10 dark:border-white/14'
                          }`}>
                          <Text
                            className={`text-[14px] font-semibold ${
                              active ? 'text-foreground' : 'text-muted'
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
                      <Text className="text-lg font-bold text-foreground">Projeção {effectiveYear}</Text>
                      <Text className="text-[12px] text-grey2">{plan.annualRate}% a.a.</Text>
                    </View>

                    <BarChart data={chartData} />

                    <View className="mt-5 flex-row justify-between border-t border-black/10 pt-4 dark:border-white/10">
                      <View>
                        <Text className="text-[12px] text-muted">
                          Projetado até {effectiveYear}
                        </Text>
                        <Text className="mt-0.5 text-base font-bold text-foreground">
                          {formatBRLCompact(projectedThroughYear(planList, effectiveYear))}
                        </Text>
                      </View>
                      <View className="items-end">
                        <Text className="text-[12px] text-muted">Real até {effectiveYear}</Text>
                        <Text className="mt-0.5 text-base font-bold text-foreground">
                          {formatBRLCompact(realThroughYear(planList, effectiveYear))}
                        </Text>
                      </View>
                    </View>
                  </GlassCard>
                </Animated.View>
              ) : (
                <Animated.View entering={FadeInUp.delay(180).springify()}>
                  <GlassCard className="mb-6 items-center p-8">
                    <Ionicons name="bar-chart-outline" size={40} color={colors.grey2} />
                    <Text className="mt-3 text-center text-base font-semibold text-foreground">
                      Nenhum ano configurado
                    </Text>
                    <Text className="mt-1 text-center text-[13px] text-muted">
                      Configure um ano com aporte mensal e taxa de juros para ver a projeção.
                    </Text>
                    <PrimaryButton
                      label="Configurar plano"
                      onPress={goToSettings}
                      className="mt-5 w-full"
                    />
                  </GlassCard>
                </Animated.View>
              )}

              {plan && (
                <Animated.View entering={FadeInUp.delay(220).springify()} className="py-1">
                  <Pressable
                    onPress={() =>
                      router.push({
                        pathname: '/aporte',
                        params: {
                          year: String(effectiveYear),
                          goalId: activeGoal.id,
                        },
                      })
                    }>
                    {({ pressed }) => {
                      const isCurrentYear = effectiveYear === currentYear;
                      const monthLabel = MONTHS_PT_FULL[new Date().getMonth()];

                      return (
                        <AnimatedGlow
                          preset={aporteCtaGlow}
                          style={{ opacity: pressed ? 0.92 : 1 }}>
                          <LinearGradient
                            colors={['#d8b4fe', '#a855f7', '#6d28d9']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={{
                              borderRadius: 22,
                              paddingVertical: 16,
                              paddingHorizontal: 16,
                            }}>
                            <View className="flex-row items-center gap-3.5">
                              <View className="flex-1">
                                <Text className="text-[16px] font-bold text-white">Adicionar aporte mensal</Text>
                                
                              </View>
                              <View className="h-12 w-12 items-center justify-center rounded-full bg-white/25">
                                <Ionicons name="add" size={26} color="#ffffff" />
                              </View>
                            </View>
                          </LinearGradient>
                        </AnimatedGlow>
                      );
                    }}
                  </Pressable>
                </Animated.View>
              )}
            </>
          )}
        </ScrollView>
      </SafeAreaView>

      <PlanPicker
        visible={pickerOpen}
        goals={goals}
        activeGoalId={activeGoalId}
        onSelect={setActiveGoalId}
        onClose={() => setPickerOpen(false)}
        onCreatePress={goToCreatePlan}
      />
    </View>
  );
}
