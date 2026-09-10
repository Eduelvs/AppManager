import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import * as React from 'react';
import { Pressable, Text, View } from 'react-native';

export function DatePicker({
  value,
  mode,
  onChange,
  materialDateClassName,
  materialDateLabel,
  materialDateLabelClassName,
  materialTimeClassName,
  materialTimeLabel,
  materialTimeLabelClassName,
  yearOnly,
  startOnYearSelection,
  title,
  design,
  ...props
}: React.ComponentProps<typeof DateTimePicker> & {
  mode: 'date' | 'time' | 'datetime';
} & {
  materialDateClassName?: string;
  materialDateLabel?: string;
  materialDateLabelClassName?: string;
  materialTimeClassName?: string;
  materialTimeLabel?: string;
  materialTimeLabelClassName?: string;
  yearOnly?: boolean;
  startOnYearSelection?: boolean;
  title?: string;
  design?: 'default' | 'material';
}) {
  const show = (currentMode: 'date' | 'time') => () => {
    DateTimePickerAndroid.open({
      value,
      mode: currentMode,
      onChange,
      minimumDate: props.minimumDate,
      maximumDate: props.maximumDate,
      startOnYearSelection,
      title,
      design: startOnYearSelection ? 'material' : design,
    });
  };

  const dateLabel = yearOnly
    ? String(value.getFullYear())
    : new Intl.DateTimeFormat('pt-BR', {
        month: 'long',
        year: 'numeric',
      }).format(value);

  if (yearOnly && mode.includes('date')) {
    return (
      <Pressable onPress={show('date')} hitSlop={8}>
        {({ pressed }) => (
          <Text
            className={`text-right text-[16px] text-white ${pressed ? 'opacity-70' : ''}`}>
            {dateLabel}
          </Text>
        )}
      </Pressable>
    );
  }

  return (
    <View className="flex-row gap-2.5">
      {mode.includes('date') && (
        <View className={`relative pt-1.5 ${materialDateClassName ?? ''}`}>
          <Pressable
            onPress={show('date')}
            className="rounded-xl border border-[rgba(255,255,255,0.14)] px-4 py-3.5">
            {({ pressed }) => (
              <Text className={`text-[15px] font-semibold capitalize text-white ${pressed ? 'opacity-70' : ''}`}>
                {dateLabel}
              </Text>
            )}
          </Pressable>
          <View className={`absolute left-3 top-0 bg-[#0b0b0f] px-1 ${materialDateLabelClassName ?? ''}`}>
            <Text className="text-[10px] text-[#a1a1aa]">{materialDateLabel ?? 'Mês'}</Text>
          </View>
        </View>
      )}
      {mode.includes('time') && (
        <View className={`relative pt-1.5 ${materialTimeClassName ?? ''}`}>
          <Pressable
            onPress={show('time')}
            className="rounded-xl border border-[rgba(255,255,255,0.14)] px-4 py-3.5">
            {({ pressed }) => (
              <Text className={`text-[15px] font-semibold text-white ${pressed ? 'opacity-70' : ''}`}>
                {new Intl.DateTimeFormat('pt-BR', { timeStyle: 'short' }).format(value)}
              </Text>
            )}
          </Pressable>
          <View className={`absolute left-3 top-0 bg-[#0b0b0f] px-1 ${materialTimeLabelClassName ?? ''}`}>
            <Text className="text-[10px] text-[#a1a1aa]">{materialTimeLabel ?? 'Hora'}</Text>
          </View>
        </View>
      )}
    </View>
  );
}
