import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FormGroup, FormInput, FormRow, SheetHeader } from '@/components/NativeForm';
import { useInvestments } from '@/lib/investment-store';

export default function PlanoNomeForm() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ goalId?: string }>();
  const goalId = typeof params.goalId === 'string' ? params.goalId : undefined;

  const { goals, createGoal, renameGoal, removeGoal } = useInvestments();
  const goal = goals.find((g) => g.id === goalId);
  const isEdit = !!goal;

  const [name, setName] = useState(goal?.name ?? '');
  const canSave = name.trim().length > 0;

  const handleSave = () => {
    if (!canSave) return;
    if (isEdit && goal) {
      renameGoal(goal.id, name);
      router.back();
      return;
    }
    createGoal(name);
    router.back();
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
            removeGoal(goal.id);
            router.dismissAll();
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.root, { paddingBottom: Math.max(insets.bottom, 16) }]}>
      <SheetHeader
        title={isEdit ? 'Editar plano' : 'Novo plano'}
        onCancel={() => router.back()}
        onSave={handleSave}
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
              <View style={[styles.deleteBtn, pressed && styles.pressed]}>
                <Text style={styles.deleteText}>Excluir plano</Text>
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
