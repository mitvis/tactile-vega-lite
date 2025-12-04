import { JSX } from 'solid-js';

interface TextAreaProps {
  label: string;
  value: string;
  onInput: (value: string) => void;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
}

export function TextArea(props: TextAreaProps) {
  const handleInput: JSX.EventHandler<HTMLTextAreaElement, InputEvent> = (e) => {
    props.onInput(e.currentTarget.value);
  };

  return (
    <div class="form-group">
      <label class="form-label">{props.label}</label>
      <textarea
        class="form-textarea"
        value={props.value}
        onInput={handleInput}
        placeholder={props.placeholder}
        rows={props.rows || 10}
        disabled={props.disabled}
      />
    </div>
  );
}
