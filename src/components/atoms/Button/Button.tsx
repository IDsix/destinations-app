import styles from './Button.module.scss';


type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  type?: 'button' | 'submit' | 'reset';
};

export function Button({
  children,
  onClick,
  disabled = false,
  isLoading = false,
  loadingText,
  type = 'button',
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${styles.button} ${!disabled? styles.buttonEnabled : ''}`}
      aria-busy={isLoading}
    >
      {isLoading && loadingText ? loadingText : children}
    </button>
  );
}