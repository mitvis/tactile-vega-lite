import { Show } from 'solid-js';
import { Select } from '../atoms/Select';
import { FieldInfo } from '../../types';

interface FieldSelectorProps {
  label: string;
  value: string | null;
  onChange: (field: string) => void;
  fields: FieldInfo[] | null;
  placeholder?: string;
}

export function FieldSelector(props: FieldSelectorProps) {
  const options = () => {
    if (!props.fields) return [];
    return props.fields.map((field) => ({
      value: field.name,
      label: `${field.name} (${field.inferredType})`,
    }));
  };

  return (
    <Show
      when={props.fields && props.fields.length > 0}
      fallback={
        <div class="form-group">
          <label class="form-label">{props.label}</label>
          <p class="form-hint">Load data to see available fields</p>
        </div>
      }
    >
      <Select
        label={props.label}
        value={props.value}
        onChange={props.onChange}
        options={options()}
        placeholder={props.placeholder || 'Select a field'}
      />
    </Show>
  );
}
