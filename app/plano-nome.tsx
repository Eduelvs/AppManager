import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FormGroup, FormInput, FormRow, SheetHeader } from '@/components/NativeForm';
import { useInvestments } from '@/lib/investment-store';
import { useColorScheme } from '@/lib/useColorScheme';

export default function PlanoNomeForm() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useColorScheme();
  const params = useLocalSearchParams<{ goalId?: string }>();
  const goalId = typeof params.goalId === 'string' ? params.goalId : undefined;

  const { goals, createGoal, renameGoal, removeGoal } = useInvestments();
  const goal = goals.find((g) => g.id === goalId);
  const isEdit = !!goal;

  const [name, setName] = useState(goal?.name ?? '');
  const [saving, setSaving] = useState(false);
  const canSave = name.trim().length > 0 && !saving;

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    try {
      if (isEdit && goal) {
        await renameGoal(goal.id, name);
      } else {
        await createGoal(name);
      }
      router.back();
    } catch (err) {
      Alert.alert('Erro', err instanceof Error ? err.message : 'Não foi possível salvar o plano.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    if (!goal) return;
    Alert.alert(
      'Excluir plano',
      `Deseja excluir “${goal.name}”? Os anos e aportes desse objetivo serão apagados.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            void (async () => {
              try {
                await removeGoal(goal.id);
                router.dismissAll();
              } catch (err) {
                Alert.alert(
                  'Erro',
                  err instanceof Error ? err.message : 'Não foi possível excluir o plano.',
                );
              }
            })();
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.sheet, paddingBottom: Math.max(insets.bottom, 16) }]}>
      <SheetHeader
        title={isEdit ? 'Editar plano' : 'Novo plano'}
        onCancel={() => router.back()}
        onSave={() => void handleSave()}
        saveDisabled={!canSave}
      />

      <View style={styles.body}>
        <FormGroup>
          <FormRow label="Nome" last>
            <FormInput
              value={name}
              onChangeText={setName}
              placeholder="Ex: Aposentadoria"
              autoCapitalize="sentences"
            />
          </FormRow>
        </FormGroup>

        {isEdit ? (
          <Pressable onPress={handleDelete} style={styles.deleteWrap}>
            {({ pressed }) => (
              <View style={[styles.deleteBtn, { backgroundColor: colors.grouped }, pressed && styles.pressed]}>
                <Text style={[styles.deleteText, { color: colors.destructive }]}>Excluir plano</Text>
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
  },
  body: {
    paddingTop: 28,
  },
  deleteWrap: {
    marginHorizontal: 16,
    marginTop: 24,
  },
  deleteBtn: {
    alignItems: 'center',
    borderRadius: 12,
    paddingVertical: 14,
  },
  pressed: {
    opacity: 0.8,
  },
  deleteText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
