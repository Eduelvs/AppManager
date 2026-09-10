import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FormGroup, FormInput, FormRow, SheetHeader } from '@/components/NativeForm';
import { DatePicker } from '@/components/nativewindui/DatePicker';
import { formatBRL, projectedThroughYear } from '@/lib/finance';
import { useInvestments } from '@/lib/investment-store';
import { parseAmount } from '@/utils/parseAmount';

export default function AnoForm() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ goalId?: string; year?: string }>();
  const goalId = typeof params.goalId === 'string' ? params.goalId : undefined;
  const originalYear = params.year ? Number(params.year) : undefined;
  const isEdit = Number.isFinite(originalYear);

  const { getPlan, upsertPlan, removePlan, goals } = useInvestments();
  const existing = isEdit && originalYear ? getPlan(originalYear, goalId) : undefined;

  const [year, setYear] = useState(originalYear || new Date().getFullYear());
  const [monthly, setMonthly] = useState(existing ? String(existing.monthlyContribution) : '');
  const [rate, setRate] = useState(existing ? String(existing.annualRate) : '');

  const monthlyValue = parseAmount(monthly);
  const rateValue = parseAmount(rate);
  const canSave = Number.isFinite(year) && year >= 1900 && year <= 2200 && monthlyValue > 0;
  const yearDate = new Date(year, 0, 1);

  const planList = useMemo(() => {
    const goal = goals.find((g) => g.id === goalId);
    return goal ? Object.values(goal.years).sort((a, b) => a.year - b.year) : [];
  }, [goals, goalId]);

  const preview = useMemo(() => {
    if (!Number.isFinite(year) || monthlyValue <= 0) return 0;
    const previous = planList.filter((p) => p.year < year && p.year !== originalYear);
    const draft = {
      year,
      monthlyContribution: monthlyValue,
      annualRate: rateValue,
      actuals: existing?.actuals ?? {},
    };
    return projectedThroughYear([...previous, draft], year);
  }, [planList, year, monthlyValue, rateValue, originalYear, existing?.actuals]);

  const handleSave = () => {
    if (!canSave || !goalId) return;

    const conflict = planList.some((p) => p.year === year && p.year !== originalYear);
    if (conflict) {
      Alert.alert('Ano já existe', 'Esse ano já está configurado neste plano.');
      return;
    }

    upsertPlan({
      year,
      monthlyContribution: monthlyValue,
      annualRate: rateValue,
      goalId,
      actuals: existing?.actuals,
    });

    if (isEdit && originalYear && originalYear !== year) {
      removePlan(originalYear, goalId);
    }

    router.back();
  };

  const handleDelete = () => {
    if (!goalId || !originalYear) return;
    Alert.alert('Excluir ano', `Remover ${originalYear} deste plano?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => {
          removePlan(originalYear, goalId);
          router.back();
        },
      },
    ]);
  };

  return (
    <View style={[styles.root, { paddingBottom: Math.max(insets.bottom, 16) }]}>
      <SheetHeader
        title={isEdit ? 'Editar ano' : 'Novo ano'}
        onCancel={() => router.back()}
        onSave={handleSave}
        saveDisabled={!canSave}
      />

      <View style={styles.body}>
        <FormGroup>
          <FormRow label="Ano">
            <View style={styles.yearField}>
              {Platform.OS === 'ios' ? <Text style={styles.yearText}>{year}</Text> : null}
              <DatePicker
                value={yearDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'compact' : 'default'}
                locale="pt-BR"
                themeVariant="dark"
                accentColor="#a855f7"
                yearOnly
                startOnYearSelection
                title="Ano"
                materialDateLabel="Ano"
                minimumDate={new Date(1990, 0, 1)}
                maximumDate={new Date(2100, 11, 31)}
                style={Platform.OS === 'ios' ? styles.yearHit : undefined}
                onChange={(ev) => {
                  const timestamp = ev.nativeEvent.timestamp;
                  if (!timestamp) return;
                  setYear(new Date(timestamp).getFullYear());
                }}
              />
            </View>
          </FormRow>
          <FormRow label="Aporte R$">
            <FormInput
              value={monthly}
              onChangeText={setMonthly}
              placeholder="0,00"
              keyboardType="decimal-pad"
            />
          </FormRow>
          <FormRow label="Taxa a.a." last>
            <FormInput
              value={rate}
              onChangeText={setRate}
              placeholder="0"
              keyboardType="decimal-pad"
            />
          </FormRow>
        </FormGroup>

        <Text style={styles.hint}>
          {canSave
            ? `Projeção ao fim de ${year}: ${formatBRL(preview)}`
            : 'Informe o ano e o aporte mensal para salvar.'}
        </Text>

        {isEdit ? (
          <Pressable onPress={handleDelete} style={styles.deleteWrap}>
            {({ pressed }) => (
              <View style={[styles.deleteBtn, pressed && styles.pressed]}>
                <Text style={styles.deleteText}>Excluir ano</Text>
              </View>
            )}
          </Pressable>
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
  yearField: {
    height: 36,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  yearText: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'right',
  },
  yearHit: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 96,
    opacity: 0.02,
  },
  hint: {
    marginHorizontal: 16,
    marginTop: 12,
    fontSize: 13,
    color: '#8e8e93',
  },
  deleteWrap: {
    marginHorizontal: 16,
    marginTop: 24,
  },
  deleteBtn: {
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#2c2c2e',
    paddingVertical: 14,
  },
  pressed: {
    opacity: 0.8,
  },
  deleteText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ff453a',
  },
});
