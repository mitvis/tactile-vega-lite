import { JSX } from 'solid-js';

interface TextInputProps {
  label: string;
  value: string;
  onInput: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'url' | 'email';
  disabled?: boolean;
}

export function TextInput(props: TextInputProps) {
  const handleInput: JSX.EventHandler<HTMLInputElement, InputEvent> = (e) => {
    props.onInput(e.currentTarget.value);
  };

  return (
    <div class="form-group">
      <label class="form-label">{props.label}</label>
      <input
        type={props.type || 'text'}
        class="form-input"
        value={props.value}
        onInput={handleInput}
        placeholder={props.placeholder}
        disabled={props.disabled}
      />
    </div>
  );
}
