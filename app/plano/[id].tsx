import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { Background } from '@/components/Background';
import { AddCard, GlassCard } from '@/components/glass';
import { formatBRL, projectedThroughYear } from '@/lib/finance';
import { useInvestments } from '@/lib/investment-store';
import { useColorScheme } from '@/lib/useColorScheme';

export default function PlanoDetalhe() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { goals, isLoading } = useInvestments();
  const { colors, isDarkColorScheme } = useColorScheme();

  const goal = goals.find((g) => g.id === id);
  const planList = useMemo(
    () => (goal ? Object.values(goal.years).sort((a, b) => a.year - b.year) : []),
    [goal]
  );

  if (!goal && isLoading) {
    return (
      <View className="flex-1 bg-background">
        <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
        <SafeAreaView className="flex-1 items-center justify-center">
          <Text className="text-muted">Carregando plano...</Text>
        </SafeAreaView>
      </View>
    );
  }

  if (!goal) {
    return (
      <View className="flex-1 bg-background">
        <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
        <SafeAreaView className="flex-1 items-center justify-center">
          <Text className="text-muted">Plano não encontrado</Text>
          <Pressable onPress={() => router.back()} className="mt-4">
            <Text className="text-[16px] font-semibold text-[#c084fc]">Voltar</Text>
          </Pressable>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
      <Background />

      <SafeAreaView className="flex-1" edges={['top']}>
        <View className="flex-row items-center justify-between px-4 py-2">
          <Pressable
            onPress={() => router.back()}
            hitSlop={12}
            className="h-10 w-10 items-center justify-center rounded-full">
            <Ionicons name="chevron-back" size={26} color={colors.foreground} />
          </Pressable>
          <Pressable
            onPress={() =>
              router.push({ pathname: '/plano-nome', params: { goalId: goal.id } })
            }
            hitSlop={12}
            className="h-10 items-center justify-center px-2">
            <Text className="text-[16px] font-semibold text-[#c084fc]">Editar</Text>
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerClassName="px-6 pb-32">
          <Animated.View entering={FadeInUp.springify()} className="mb-10 mt-4 items-center">
            <Text className="text-center text-3xl font-bold text-foreground">{goal.name}</Text>
          </Animated.View>

          <Text className="mb-3 text-[13px] font-semibold uppercase tracking-widest text-muted">
            Anos configurados
          </Text>

          <View className="gap-3">
            {planList.map((p, index) => (
              <Animated.View
                key={p.year}
                entering={FadeInUp.delay(60 + index * 40).springify()}>
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: '/ano',
                      params: { goalId: goal.id, year: String(p.year) },
                    })
                  }>
                  {({ pressed }) => (
                    <GlassCard className={`p-4 ${pressed ? 'opacity-80' : ''}`}>
                      <View className="flex-row items-center justify-between">
                        <Text className="text-[16px] font-bold text-foreground">{p.year}</Text>
                        <Ionicons name="chevron-forward" size={18} color={colors.grey2} />
                      </View>
                      <Text className="mt-1 text-[13px] text-muted">
                        {formatBRL(p.monthlyContribution)}/mês · {p.annualRate}% a.a.
                      </Text>
                      <Text className="mt-1 text-[13px] font-semibold text-[#c084fc]">
                        Projeção: {formatBRL(projectedThroughYear(planList, p.year))}
                      </Text>
                    </GlassCard>
                  )}
                </Pressable>
              </Animated.View>
            ))}

            <Animated.View entering={FadeInUp.delay(60 + planList.length * 40).springify()}>
              <AddCard
                onPress={() =>
                  router.push({ pathname: '/ano', params: { goalId: goal.id } })
                }
              />
            </Animated.View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
