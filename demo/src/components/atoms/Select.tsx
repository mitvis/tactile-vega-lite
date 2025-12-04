import { For, JSX } from 'solid-js';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label: string;
  value: string | null;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
}

export function Select(props: SelectProps) {
  const handleChange: JSX.EventHandler<HTMLSelectElement, Event> = (e) => {
    const value = e.currentTarget.value;
    if (value) {
      props.onChange(value);
    }
  };

  return (
    <div class="form-group">
      <label class="form-label">{props.label}</label>
      <select
        class="form-select"
        value={props.value || ''}
        onChange={handleChange}
        disabled={props.disabled}
      >
        {props.placeholder && (
          <option value="" disabled>
            {props.placeholder}
          </option>
        )}
        <For each={props.options}>
          {(option) => <option value={option.value}>{option.label}</option>}
        </For>
      </select>
    </div>
  );
}
