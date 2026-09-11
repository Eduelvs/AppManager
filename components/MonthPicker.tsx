import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { MONTHS_PT_FULL } from '@/lib/finance';
import { useColorScheme } from '@/lib/useColorScheme';

export function MonthPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (month: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const { colors } = useColorScheme();

  const items = MONTHS_PT_FULL.map((label, index) => (
    <Picker.Item key={label} label={label} value={index} color={colors.foreground} />
  ));

  if (Platform.OS === 'android') {
    return (
      <Picker
        selectedValue={value}
        onValueChange={(next) => onChange(Number(next))}
        mode="dropdown"
        dropdownIconColor={colors.primary}
        style={[styles.androidPicker, { color: colors.foreground }]}>
        {items}
      </Picker>
    );
  }

  return (
    <>
      <Pressable onPress={() => setOpen(true)} hitSlop={8} style={styles.field}>
        <Text style={[styles.fieldText, { color: colors.foreground }]}>{MONTHS_PT_FULL[value]}</Text>
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="slide"
        presentationStyle="overFullScreen"
        onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <Pressable style={[styles.wheelSheet, { backgroundColor: colors.grouped }]} onPress={() => {}}>
            <View style={styles.wheelBar}>
              <Text style={[styles.wheelTitle, { color: colors.muted }]}>Mês</Text>
              <Pressable onPress={() => setOpen(false)} hitSlop={8}>
                <Text style={[styles.wheelDone, { color: colors.primary }]}>OK</Text>
              </Pressable>
            </View>
            <Picker
              selectedValue={value}
              onValueChange={(next) => onChange(Number(next))}
              itemStyle={[styles.wheelItem, { color: colors.foreground }]}>
              {items}
            </Picker>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  field: {
    minHeight: 36,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  fieldText: {
    fontSize: 16,
    textAlign: 'right',
  },
  androidPicker: {
    width: 180,
    backgroundColor: 'transparent',
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  wheelSheet: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  wheelBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  wheelTitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  wheelDone: {
    fontSize: 17,
    fontWeight: '600',
  },
  wheelItem: {
    fontSize: 20,
  },
});
