import { Select } from '../atoms/Select';
import { FieldType } from '../../types';

interface TypeSelectorProps {
  label?: string;
  value: FieldType | null;
  onChange: (type: FieldType) => void;
}

export function TypeSelector(props: TypeSelectorProps) {
  const options = [
    { value: 'nominal', label: 'Nominal' },
    { value: 'ordinal', label: 'Ordinal' },
    { value: 'quantitative', label: 'Quantitative' },
    { value: 'temporal', label: 'Temporal' },
  ];

  return (
    <Select
      label={props.label || 'Type'}
      value={props.value}
      onChange={(value) => props.onChange(value as FieldType)}
      options={options}
      placeholder="Select type"
    />
  );
}
