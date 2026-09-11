import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { MONTHS_PT_FULL } from '@/lib/finance';

export function MonthPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (month: number) => void;
}) {
  const [open, setOpen] = useState(false);

  const items = MONTHS_PT_FULL.map((label, index) => (
    <Picker.Item key={label} label={label} value={index} color="#ffffff" />
  ));

  if (Platform.OS === 'android') {
    return (
      <Picker
        selectedValue={value}
        onValueChange={(next) => onChange(Number(next))}
        mode="dropdown"
        dropdownIconColor="#c084fc"
        style={styles.androidPicker}>
        {items}
      </Picker>
    );
  }

  return (
    <>
      <Pressable onPress={() => setOpen(true)} hitSlop={8} style={styles.field}>
        <Text style={styles.fieldText}>{MONTHS_PT_FULL[value]}</Text>
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="slide"
        presentationStyle="overFullScreen"
        onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <Pressable style={styles.wheelSheet} onPress={() => {}}>
            <View style={styles.wheelBar}>
              <Text style={styles.wheelTitle}>Mês</Text>
              <Pressable onPress={() => setOpen(false)} hitSlop={8}>
                <Text style={styles.wheelDone}>OK</Text>
              </Pressable>
            </View>
            <Picker
              selectedValue={value}
              onValueChange={(next) => onChange(Number(next))}
              itemStyle={styles.wheelItem}>
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
    color: '#ffffff',
    textAlign: 'right',
  },
  androidPicker: {
    width: 180,
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  wheelSheet: {
    backgroundColor: '#2c2c2e',
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
    color: '#8e8e93',
  },
  wheelDone: {
    fontSize: 17,
    fontWeight: '600',
    color: '#c084fc',
  },
  wheelItem: {
    color: '#ffffff',
    fontSize: 20,
  },
});
