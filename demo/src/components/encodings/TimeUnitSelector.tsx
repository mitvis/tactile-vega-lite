import { Show } from 'solid-js';
import { Select } from '../atoms/Select';
import { TimeUnit, FieldType } from '../../types';
import { TIME_UNITS } from '../../utils/constants';

interface TimeUnitSelectorProps {
  label?: string;
  value: TimeUnit | undefined;
  onChange: (timeUnit: TimeUnit | undefined) => void;
  fieldType: FieldType | null;
}

export function TimeUnitSelector(props: TimeUnitSelectorProps) {
  const options = [
    { value: 'none', label: 'None' },
    ...TIME_UNITS.map((unit) => ({
      value: unit,
      label: unit.charAt(0).toUpperCase() + unit.slice(1),
    })),
  ];

  const handleChange = (value: string) => {
    if (value === 'none') {
      props.onChange(undefined);
    } else {
      props.onChange(value as TimeUnit);
    }
  };

  return (
    <Show when={props.fieldType === 'temporal'}>
      <Select
        label={props.label || 'Time Unit'}
        value={props.value || 'none'}
        onChange={handleChange}
        options={options}
      />
    </Show>
  );
}
