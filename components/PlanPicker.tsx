import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';

import type { Goal } from '@/lib/finance';
import { useColorScheme } from '@/lib/useColorScheme';

type PlanPickerProps = {
  visible: boolean;
  goals: Goal[];
  activeGoalId: string | null;
  onSelect: (id: string) => void;
  onClose: () => void;
  onCreatePress?: () => void;
};

export function PlanPicker({
  visible,
  goals,
  activeGoalId,
  onSelect,
  onClose,
  onCreatePress,
}: PlanPickerProps) {
  const { colors, isDarkColorScheme } = useColorScheme();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        className={`flex-1 justify-end ${isDarkColorScheme ? 'bg-black/70' : 'bg-black/40'}`}
        onPress={onClose}>
        <Pressable
          className="mx-5 mb-10 overflow-hidden rounded-2xl border"
          style={{ backgroundColor: colors.card, borderColor: colors.border }}
          onPress={() => {}}>
          <View className="border-b px-5 py-4" style={{ borderBottomColor: colors.border }}>
            <Text className="text-[13px] font-semibold uppercase tracking-widest text-muted">
              Objetivo
            </Text>
            <Text className="mt-1 text-lg font-bold text-foreground">Escolher plano</Text>
          </View>

          {goals.length === 0 ? (
            <View className="px-5 py-6">
              <Text className="text-center text-[14px] text-muted">
                Nenhum plano criado ainda.
              </Text>
            </View>
          ) : (
            <ScrollView style={{ maxHeight: 360 }} className="py-2">
              {goals.map((goal) => {
                const active = goal.id === activeGoalId;
                return (
                  <Pressable
                    key={goal.id}
                    onPress={() => {
                      onSelect(goal.id);
                      onClose();
                    }}
                    className="flex-row items-center gap-3 px-5 py-3.5">
                    <View
                      className={`h-9 w-9 items-center justify-center rounded-full ${
                        active ? 'bg-[rgba(168,85,247,0.25)]' : isDarkColorScheme ? 'bg-white/10' : 'bg-black/5'
                      }`}>
                      <Ionicons
                        name={active ? 'flag' : 'flag-outline'}
                        size={16}
                        color={active ? '#c084fc' : colors.muted}
                      />
                    </View>
                    <Text
                      className={`flex-1 text-[16px] font-semibold ${
                        active ? 'text-foreground' : 'text-muted'
                      }`}
                      numberOfLines={1}>
                      {goal.name}
                    </Text>
                    {active ? (
                      <Ionicons name="checkmark" size={20} color="#c084fc" />
                    ) : null}
                  </Pressable>
                );
              })}
            </ScrollView>
          )}

          {onCreatePress ? (
            <Pressable
              onPress={() => {
                onClose();
                onCreatePress();
              }}
              className="flex-row items-center gap-3 border-t px-5 py-4"
              style={{ borderTopColor: colors.border }}>
              <View className="h-9 w-9 items-center justify-center rounded-full bg-[rgba(168,85,247,0.2)]">
                <Ionicons name="add" size={18} color="#c084fc" />
              </View>
              <Text className="text-[15px] font-semibold text-[#c084fc]">Criar novo plano</Text>
            </Pressable>
          ) : null}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
