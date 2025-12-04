import { JSX } from 'solid-js';

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function Toggle(props: ToggleProps) {
  const handleChange: JSX.EventHandler<HTMLInputElement, Event> = (e) => {
    props.onChange(e.currentTarget.checked);
  };

  return (
    <div class="form-group">
      <label class="form-label-inline">
        <input
          type="checkbox"
          class="form-checkbox"
          checked={props.checked}
          onChange={handleChange}
          disabled={props.disabled}
        />
        <span>{props.label}</span>
      </label>
    </div>
  );
}
