import React, { useRef } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

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
  return (
    <View style={styles.header}>
      <Pressable onPress={onCancel} hitSlop={8} style={styles.headerSide}>
        <Text style={styles.cancel}>Cancelar</Text>
      </Pressable>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <Pressable
        onPress={onSave}
        hitSlop={8}
        disabled={saveDisabled}
        style={[styles.headerSide, styles.headerRight]}>
        <Text style={[styles.save, saveDisabled && styles.saveDisabled]}>Salvar</Text>
      </Pressable>
    </View>
  );
}

export function FormGroup({ children }: { children: React.ReactNode }) {
  return <View style={styles.group}>{children}</View>;
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
  return (
    <View style={[styles.row, !last && styles.rowBorder]}>
      <Text style={styles.label}>{label}</Text>
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
      placeholderTextColor="rgba(255,255,255,0.28)"
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      autoCorrect={false}
      cursorColor="#c084fc"
      selectionColor="#c084fc"
      onFocus={moveCaretToEnd}
      style={styles.input}
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
    borderBottomColor: 'rgba(255,255,255,0.12)',
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
    color: '#ffffff',
  },
  cancel: {
    fontSize: 17,
    color: '#c084fc',
  },
  save: {
    fontSize: 17,
    fontWeight: '600',
    color: '#c084fc',
  },
  saveDisabled: {
    color: '#71717a',
  },
  group: {
    marginHorizontal: 16,
    overflow: 'hidden',
    borderRadius: 12,
    backgroundColor: '#2c2c2e',
  },
  row: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#3a3a3c',
  },
  label: {
    width: '44%',
    paddingVertical: 12,
    fontSize: 16,
    color: '#ffffff',
  },
  rowField: {
    flex: 1,
  },
  input: {
    paddingVertical: 12,
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'right',
  },
});
