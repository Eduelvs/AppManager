import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DatePicker } from '@/components/nativewindui/DatePicker';
import { MONTHS_PT_FULL, formatBRL } from '@/lib/finance';
import { useInvestments } from '@/lib/investment-store';

/* Converte texto digitado em número (aceita vírgula ou ponto). */
function parseAmount(text: string): number {
  const cleaned = text.replace(/[^0-9,.]/g, '').replace(/\.(?=\d{3}\b)/g, '').replace(',', '.');
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : 0;
}

/**
 * Tela de registro de aporte — apresentada como modal nativo de página.
 * Botão "Salvar" fixo no rodapé (sempre visível, acima do teclado).
 */
export default function AporteModal() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ year?: string }>();
  const year = Number(params.year) || new Date().getFullYear();

  const { getPlan, setActual } = useInvestments();
  const plan = getPlan(year);
  const plannedMonthly = plan?.monthlyContribution ?? 0;
  const actuals = plan?.actuals ?? {};

  const [month, setMonth] = useState<number>(new Date().getMonth());
  const [amount, setAmount] = useState<string>(
    actuals[new Date().getMonth()] ? String(actuals[new Date().getMonth()]) : ''
  );

  const selectedDate = new Date(year, month, 1);

  const handleSelectMonth = (m: number) => {
    setMonth(m);
    setAmount(actuals[m] ? String(actuals[m]) : '');
  };

  const handleSave = () => {
    setActual(year, month, parseAmount(amount));
    router.back();
  };

  const existing = actuals[month];

  return (
    <View style={styles.root}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Registrar aporte</Text>
          <Text style={styles.subtitle}>Ano de {year}</Text>
        </View>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.closeBtn}>
          <Ionicons name="close" size={20} color="#a1a1aa" />
        </Pressable>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          style={styles.flex}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}>
          {/* Seleção de mês (picker nativo NativeWindUI) */}
          <Text style={styles.label}>Mês</Text>
          <View className="items-center overflow-hidden rounded-2xl bg-[rgba(255,255,255,0.04)]">
            <DatePicker
              value={selectedDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              locale="pt-BR"
              themeVariant="dark"
              accentColor="#a855f7"
              minimumDate={new Date(year, 0, 1)}
              maximumDate={new Date(year, 11, 31)}
              materialDateLabel="Mês"
              onChange={(ev) => {
                const timestamp = ev.nativeEvent.timestamp;
                if (!timestamp) return;
                handleSelectMonth(new Date(timestamp).getMonth());
              }}
            />
          </View>
          <Text style={styles.monthHint}>
            {MONTHS_PT_FULL[month]} de {year}
            {actuals[month] != null ? ' · já tem aporte' : ''}
          </Text>

          {/* Valor */}
          <View style={styles.valueLabelRow}>
            <Text style={styles.label}>Valor aportado</Text>
            {plannedMonthly > 0 && (
              <Pressable onPress={() => setAmount(String(plannedMonthly))} hitSlop={8}>
                <Text style={styles.usePlanned}>Usar planejado ({formatBRL(plannedMonthly)})</Text>
              </Pressable>
            )}
          </View>
          <View style={styles.inputBox}>
            <Text style={styles.currency}>R$</Text>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              placeholder="0,00"
              placeholderTextColor="rgba(255,255,255,0.4)"
              keyboardType="decimal-pad"
              cursorColor="#d1a0f2"
              selectionColor="#d1a0f2"
              style={styles.input}
            />
          </View>
          {existing != null && (
            <Text style={styles.hint}>Já registrado: {formatBRL(existing)}</Text>
          )}
        </ScrollView>

        {/* Rodapé fixo com o botão */}
        <View style={[styles.footer, { paddingBottom: 16 + insets.bottom }]}>
          <Pressable onPress={handleSave}>
            {({ pressed }) => (
              <View
                className={`min-h-[56px] w-full items-center justify-center rounded-2xl bg-[#a855f7] py-[18px] ${
                  pressed ? 'opacity-80' : ''
                }`}>
                <Text className="text-[17px] font-bold text-white">Salvar aporte</Text>
              </View>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0b0b0f' },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
  },
  title: { fontSize: 22, fontWeight: '700', color: '#ffffff' },
  subtitle: { marginTop: 2, fontSize: 13, color: '#a1a1aa' },
  closeBtn: {
    height: 36,
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  label: { marginBottom: 8, fontSize: 13, fontWeight: '500', color: '#c9c9cf' },
  monthHint: { marginTop: 8, fontSize: 13, color: '#a1a1aa' },
  valueLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 8,
  },
  usePlanned: { fontSize: 12, fontWeight: '600', color: '#c084fc' },
  inputBox: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    paddingHorizontal: 16,
  },
  currency: { marginRight: 4, fontSize: 16, color: '#a1a1aa' },
  input: { flex: 1, fontSize: 16, color: '#ffffff' },
  hint: { marginTop: 8, fontSize: 12, color: '#71717a' },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
});
