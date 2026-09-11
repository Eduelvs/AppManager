import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MonthPicker } from '@/components/MonthPicker';
import { FormGroup, FormInput, FormRow, SheetHeader } from '@/components/NativeForm';
import { MONTHS_PT_FULL, formatBRL } from '@/lib/finance';
import { useInvestments } from '@/lib/investment-store';
import { parseAmount } from '@/utils/parseAmount';

export default function AporteModal() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ year?: string; goalId?: string }>();
  const year = Number(params.year) || new Date().getFullYear();
  const goalId = typeof params.goalId === 'string' ? params.goalId : undefined;

  const { getPlan, setActual, goals } = useInvestments();
  const plan = getPlan(year, goalId);
  const goalName = goals.find((g) => g.id === (goalId ?? ''))?.name;
  const plannedMonthly = plan?.monthlyContribution ?? 0;
  const actuals = plan?.actuals ?? {};

  const [month, setMonth] = useState<number>(new Date().getMonth());
  const [amount, setAmount] = useState<string>(
    actuals[new Date().getMonth()] ? String(actuals[new Date().getMonth()]) : ''
  );

  const existing = actuals[month];
  const canSave = parseAmount(amount) > 0 || existing != null;

  const handleSelectMonth = (m: number) => {
    setMonth(m);
    setAmount(actuals[m] ? String(actuals[m]) : '');
  };

  const handleSave = () => {
    setActual(year, month, parseAmount(amount), goalId);
    router.back();
  };

  return (
    <View style={[styles.root, { paddingBottom: Math.max(insets.bottom, 16) }]}>
      <SheetHeader
        title="Aporte"
        onCancel={() => router.back()}
        onSave={handleSave}
        saveDisabled={!canSave && !amount}
      />

      <View style={styles.body}>
        <FormGroup>
          <FormRow label="Mês">
            <MonthPicker value={month} onChange={handleSelectMonth} />
          </FormRow>
          <FormRow label="Valor R$" last>
            <FormInput
              value={amount}
              onChangeText={setAmount}
              placeholder="0,00"
              keyboardType="decimal-pad"
            />
          </FormRow>
        </FormGroup>

        {plannedMonthly > 0 ? (
          <Pressable onPress={() => setAmount(String(plannedMonthly))} hitSlop={8}>
            <Text style={styles.hint}>Usar planejado ({formatBRL(plannedMonthly)})</Text>
          </Pressable>
        ) : (
          <Text style={styles.hint}>
            {goalName ? `${goalName} · ` : ''}
            {MONTHS_PT_FULL[month]} de {year}
          </Text>
        )}

        {existing != null ? (
          <Text style={styles.hintMuted}>Já registrado: {formatBRL(existing)}</Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#1c1c1e',
  },
  body: {
    paddingTop: 28,
  },
  hint: {
    marginHorizontal: 16,
    marginTop: 12,
    fontSize: 13,
    fontWeight: '600',
    color: '#c084fc',
  },
  hintMuted: {
    marginHorizontal: 16,
    marginTop: 8,
    fontSize: 13,
    color: '#8e8e93',
  },
});
