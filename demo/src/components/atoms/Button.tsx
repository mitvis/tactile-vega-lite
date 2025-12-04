import { JSX, Show } from 'solid-js';

interface ButtonProps {
  onClick: () => void;
  children: JSX.Element;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  loading?: boolean;
}

export function Button(props: ButtonProps) {
  return (
    <button
      class={`button button-${props.variant || 'primary'}`}
      onClick={props.onClick}
      disabled={props.disabled || props.loading}
    >
      <Show when={props.loading} fallback={props.children}>
        Loading...
      </Show>
    </button>
  );
}
