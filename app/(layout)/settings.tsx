import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { Background } from '@/components/Background';
import { GlassCard, GlassField, PrimaryButton } from '@/components/glass';
import { formatBRL, projectedThroughYear } from '@/lib/finance';
import { useInvestments } from '@/lib/investment-store';

function parseNumber(text: string): number {
  const cleaned = text.replace(/[^0-9,.]/g, '').replace(/\.(?=\d{3}\b)/g, '').replace(',', '.');
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : 0;
}

export default function Settings() {
  const { planList, getPlan, upsertPlan, removePlan } = useInvestments();

  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState<number>(currentYear);
  const [monthly, setMonthly] = useState<string>('');
  const [rate, setRate] = useState<string>('');

  const existing = getPlan(year);
  useEffect(() => {
    if (existing) {
      setMonthly(String(existing.monthlyContribution));
      setRate(String(existing.annualRate));
    } else {
      setMonthly('');
      setRate('');
    }
  }, [year]);

  const canSave = parseNumber(monthly) > 0;

  const previewTotal = useMemo(() => {
    const m = parseNumber(monthly);
    const r = parseNumber(rate);
    const previous = planList.filter((p) => p.year < year);
    if (m <= 0 && previous.length === 0) return 0;

    const draft = {
      year,
      monthlyContribution: m,
      annualRate: r,
      actuals: {},
    };
    const merged = [...previous, draft];
    return projectedThroughYear(merged, year);
  }, [monthly, rate, year, planList]);

  const handleSave = () => {
    upsertPlan({
      year,
      monthlyContribution: parseNumber(monthly),
      annualRate: parseNumber(rate),
    });
  };

  const quickYears = [currentYear - 1, currentYear, currentYear + 1, currentYear + 2];

  return (
    <View className="flex-1 bg-black">
      <StatusBar style="light" />
      <Background />

      <SafeAreaView className="flex-1" edges={['top']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerClassName="px-6 pt-4 pb-32">
          <Animated.View entering={FadeInUp.springify()} className="mb-6">
            <Text className="text-[13px] font-semibold uppercase tracking-widest text-[#a1a1aa]">
              Configurações
            </Text>
            <Text className="mt-1 text-3xl font-bold text-white">Plano de aportes</Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(60).springify()}>
            <GlassCard className="mb-6 p-5">
              {/* Seletor de ano */}
              <Text className="mb-2 text-[13px] font-medium text-[#c9c9cf]">Ano</Text>
              <View className="mb-3 flex-row items-center justify-between">
                <Pressable
                  onPress={() => setYear((y) => y - 1)}
                  className="h-10 w-10 items-center justify-center rounded-full border border-[rgba(255,255,255,0.14)]">
                  <Ionicons name="remove" size={20} color="#fff" />
                </Pressable>
                <Text className="text-3xl font-bold text-white">{year}</Text>
                <Pressable
                  onPress={() => setYear((y) => y + 1)}
                  className="h-10 w-10 items-center justify-center rounded-full border border-[rgba(255,255,255,0.14)]">
                  <Ionicons name="add" size={20} color="#fff" />
                </Pressable>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerClassName="gap-2 pb-1"
                className="mb-5">
                {quickYears.map((y) => {
                  const active = y === year;
                  const configured = !!getPlan(y);
                  return (
                    <Pressable
                      key={y}
                      onPress={() => setYear(y)}
                      className={`flex-row items-center gap-1.5 rounded-full border px-3.5 py-2 ${
                        active
                          ? 'border-[#d1a0f2] bg-[rgba(168,85,247,0.2)]'
                          : 'border-[rgba(255,255,255,0.14)]'
                      }`}>
                      {configured && <View className="h-1.5 w-1.5 rounded-full bg-[#c084fc]" />}
                      <Text
                        className={`text-[13px] font-semibold ${
                          active ? 'text-white' : 'text-[#a1a1aa]'
                        }`}>
                        {y}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>

              <GlassField
                label="Aporte mensal planejado"
                placeholder="0,00"
                value={monthly}
                onChangeText={setMonthly}
                keyboardType="decimal-pad"
                prefix="R$"
              />

              <GlassField
                label="Taxa de juros (ao ano)"
                placeholder="0"
                value={rate}
                onChangeText={setRate}
                keyboardType="decimal-pad"
                suffix="% a.a."
              />

              <View className="mt-1 flex-row items-center justify-between rounded-xl bg-[rgba(168,85,247,0.1)] px-4 py-3">
                <Text className="text-[13px] text-[#c9c9cf]">Projeção ao fim de {year}</Text>
                <Text className="text-[15px] font-bold text-[#c084fc]">
                  {formatBRL(previewTotal)}
                </Text>
              </View>

              <PrimaryButton
                label={existing ? 'Atualizar ano' : 'Salvar ano'}
                onPress={handleSave}
                className={`mt-5 ${canSave ? '' : 'opacity-40'}`}
              />
            </GlassCard>
          </Animated.View>

          {planList.length > 0 && (
            <Animated.View entering={FadeInUp.delay(120).springify()}>
              <Text className="mb-3 text-lg font-bold text-white">Anos configurados</Text>
              <View className="gap-3">
                {planList.map((p) => (
                  <GlassCard key={p.year} className="flex-row items-center p-4">
                    <Pressable className="flex-1" onPress={() => setYear(p.year)}>
                      <Text className="text-[16px] font-bold text-white">{p.year}</Text>
                      <Text className="mt-0.5 text-[13px] text-[#a1a1aa]">
                        {formatBRL(p.monthlyContribution)}/mês · {p.annualRate}% a.a.
                      </Text>
                      <Text className="mt-1 text-[13px] font-semibold text-[#c084fc]">
                        Projeção: {formatBRL(projectedThroughYear(planList, p.year))}
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={() => removePlan(p.year)}
                      hitSlop={10}
                      className="h-9 w-9 items-center justify-center rounded-full border border-[rgba(255,255,255,0.12)]">
                      <Ionicons name="trash-outline" size={17} color="#f87171" />
                    </Pressable>
                  </GlassCard>
                ))}
              </View>
            </Animated.View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
