import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { Background } from '@/components/Background';
import { AddCard, GlassCard } from '@/components/glass';
import { formatBRL, portfolioProjected } from '@/lib/finance';
import { useInvestments } from '@/lib/investment-store';
import { useAuth } from '@/lib/auth';
import { useColorScheme } from '@/lib/useColorScheme';

export default function Settings() {
  const router = useRouter();
  const { goals, isLoading, setActiveGoalId } = useInvestments();
  const { logout, user } = useAuth();
  const { colors, isDarkColorScheme } = useColorScheme();

  return (
    <View className="flex-1 bg-background">
      <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
      <Background />

      <SafeAreaView className="flex-1" edges={['top']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerClassName="px-6 pt-4 pb-32">
          <Animated.View entering={FadeInUp.springify()} className="mb-6">
            <Text className="text-[13px] font-semibold uppercase tracking-widest text-muted">
              Configurações
            </Text>
            <Text className="mt-1 text-3xl font-bold text-foreground">Planos</Text>
          </Animated.View>

          <View className="gap-3">
            {isLoading ? (
              <View className="items-center py-10">
                <ActivityIndicator color="#c084fc" />
              </View>
            ) : null}

            {goals.map((goal, index) => {
              const years = Object.values(goal.years).sort((a, b) => a.year - b.year);
              const count = years.length;
              return (
                <Animated.View
                  key={goal.id}
                  entering={FadeInUp.delay(40 + index * 40).springify()}>
                  <Pressable
                    onPress={() => {
                      setActiveGoalId(goal.id);
                      router.push(`/plano/${goal.id}`);
                    }}>
                    {({ pressed }) => (
                      <GlassCard
                        className={`flex-row items-center p-5 ${pressed ? 'opacity-80' : ''}`}>
                        <View className="flex-1 pr-3">
                          <Text className="text-[17px] font-bold text-foreground" numberOfLines={1}>
                            {goal.name}
                          </Text>
                          <Text className="mt-1 text-[13px] text-muted">
                            {count === 0
                              ? 'Nenhum ano ainda'
                              : `${count} ${count === 1 ? 'ano' : 'anos'} · ${formatBRL(
                                  portfolioProjected(years)
                                )}`}
                          </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color={colors.grey2} />
                      </GlassCard>
                    )}
                  </Pressable>
                </Animated.View>
              );
            })}

            <Animated.View entering={FadeInUp.delay(40 + goals.length * 40).springify()}>
              <AddCard onPress={() => router.push('/plano-nome')} />
            </Animated.View>
          </View>

          <Pressable
            onPress={() => void logout()}
            className="mt-10 overflow-hidden rounded-[14px]">
            {({ pressed }) => (
              <View
                className={`items-center py-4 ${pressed ? 'opacity-80' : ''}`}
                style={{ backgroundColor: colors.grouped }}>
                <Text className="text-[16px] font-semibold text-[#ff453a]">Sair</Text>
                {user?.email ? (
                  <Text className="mt-1 text-[12px] text-muted">{user.email}</Text>
                ) : null}
              </View>
            )}
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
