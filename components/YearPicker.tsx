import { Picker } from '@react-native-picker/picker';
import { useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

function buildYears(selected: number, minYear: number, maxYear: number): number[] {
  const years: number[] = [];
  for (let year = minYear; year <= maxYear; year++) years.push(year);
  if (!years.includes(selected)) years.push(selected);
  return years.sort((a, b) => a - b);
}

export function YearPicker({
  value,
  onChange,
  minYear,
  maxYear,
}: {
  value: number;
  onChange: (year: number) => void;
  minYear?: number;
  maxYear?: number;
}) {
  const [open, setOpen] = useState(false);
  const current = new Date().getFullYear();
  const years = useMemo(
    () => buildYears(value, minYear ?? current - 30, maxYear ?? current + 30),
    [value, minYear, maxYear, current]
  );

  return (
    <>
      <Pressable onPress={() => setOpen(true)} hitSlop={8} style={styles.field}>
        <Text style={styles.fieldText}>{value}</Text>
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
              <Text style={styles.wheelTitle}>Ano</Text>
              <Pressable onPress={() => setOpen(false)} hitSlop={8}>
                <Text style={styles.wheelDone}>OK</Text>
              </Pressable>
            </View>
            <Picker
              selectedValue={value}
              onValueChange={(next) => onChange(Number(next))}
              itemStyle={styles.wheelItem}>
              {years.map((year) => (
                <Picker.Item key={year} label={String(year)} value={year} color="#ffffff" />
              ))}
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
