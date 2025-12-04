import { Select } from '../atoms/Select';
import { AggregateFunction } from '../../types';
import { AGGREGATE_FUNCTIONS } from '../../utils/constants';

interface AggregateSelectorProps {
  label?: string;
  value: AggregateFunction | undefined;
  onChange: (aggregate: AggregateFunction | undefined) => void;
}

export function AggregateSelector(props: AggregateSelectorProps) {
  const options = [
    { value: 'none', label: 'None' },
    ...AGGREGATE_FUNCTIONS.map((agg) => ({
      value: agg,
      label: agg.charAt(0).toUpperCase() + agg.slice(1),
    })),
  ];

  const handleChange = (value: string) => {
    if (value === 'none') {
      props.onChange(undefined);
    } else {
      props.onChange(value as AggregateFunction);
    }
  };

  return (
    <Select
      label={props.label || 'Aggregate'}
      value={props.value || 'none'}
      onChange={handleChange}
      options={options}
    />
  );
}
