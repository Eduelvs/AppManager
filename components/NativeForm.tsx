import React, { useRef } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useColorScheme } from '@/lib/useColorScheme';

export function SheetHeader({
  title,
  onCancel,
  onSave,
  saveDisabled,
}: {
  title: string;
  onCancel: () => void;
  onSave: () => void;
  saveDisabled?: boolean;
}) {
  const { colors } = useColorScheme();

  return (
    <View style={[styles.header, { borderBottomColor: colors.border }]}>
      <Pressable onPress={onCancel} hitSlop={8} style={styles.headerSide}>
        <Text style={[styles.cancel, { color: colors.primary }]}>Cancelar</Text>
      </Pressable>
      <Text style={[styles.title, { color: colors.foreground }]} numberOfLines={1}>
        {title}
      </Text>
      <Pressable
        onPress={onSave}
        hitSlop={8}
        disabled={saveDisabled}
        style={[styles.headerSide, styles.headerRight]}>
        <Text style={[styles.save, { color: saveDisabled ? colors.grey2 : colors.primary }]}>
          Salvar
        </Text>
      </Pressable>
    </View>
  );
}

export function FormGroup({ children }: { children: React.ReactNode }) {
  const { colors } = useColorScheme();

  return <View style={[styles.group, { backgroundColor: colors.grouped }]}>{children}</View>;
}

export function FormRow({
  label,
  last,
  children,
}: {
  label: string;
  last?: boolean;
  children: React.ReactNode;
}) {
  const { colors } = useColorScheme();

  return (
    <View style={[styles.row, !last && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border }]}>
      <Text style={[styles.label, { color: colors.foreground }]}>{label}</Text>
      <View style={styles.rowField}>{children}</View>
    </View>
  );
}

export function FormInput({
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  autoCapitalize = 'none',
}: {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric' | 'decimal-pad' | 'number-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words';
}) {
  const inputRef = useRef<TextInput>(null);
  const { colors, isDarkColorScheme } = useColorScheme();

  const moveCaretToEnd = () => {
    const end = value.length;
    setTimeout(() => {
      inputRef.current?.setNativeProps({ selection: { start: end, end } });
    }, 50);
  };

  return (
    <TextInput
      ref={inputRef}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={isDarkColorScheme ? 'rgba(255,255,255,0.28)' : 'rgba(0,0,0,0.28)'}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      autoCorrect={false}
      cursorColor={colors.primary}
      selectionColor={colors.primary}
      onFocus={moveCaretToEnd}
      style={[styles.input, { color: colors.foreground }]}
    />
  );
}

const styles = StyleSheet.create({
  header: {
    zIndex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 28,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerSide: {
    minWidth: 78,
    minHeight: 44,
    justifyContent: 'center',
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  cancel: {
    fontSize: 17,
  },
  save: {
    fontSize: 17,
    fontWeight: '600',
  },
  group: {
    marginHorizontal: 16,
    overflow: 'hidden',
    borderRadius: 12,
  },
  row: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  label: {
    width: '44%',
    paddingVertical: 12,
    fontSize: 16,
  },
  rowField: {
    flex: 1,
  },
  input: {
    paddingVertical: 12,
    fontSize: 16,
    textAlign: 'right',
  },
});
