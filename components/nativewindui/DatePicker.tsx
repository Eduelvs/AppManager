import DateTimePicker from '@react-native-community/datetimepicker';
import * as React from 'react';

export function DatePicker({
  materialDateClassName: _materialDateClassName,
  materialDateLabel: _materialDateLabel,
  materialDateLabelClassName: _materialDateLabelClassName,
  materialTimeClassName: _materialTimeClassName,
  materialTimeLabel: _materialTimeLabel,
  materialTimeLabelClassName: _materialTimeLabelClassName,
  yearOnly: _yearOnly,
  startOnYearSelection: _startOnYearSelection,
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
}) {
  return <DateTimePicker {...props} />;
}

