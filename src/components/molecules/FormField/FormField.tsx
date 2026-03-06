import styles from './FormField.module.scss';

type FormFieldProps = {
  id: string;
  label: string;
  type?: 'text' | 'password' | 'email';
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  required?: boolean;
  optional?: boolean;
};

export function FormField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  disabled = false,
  placeholder,
  required = false,
  optional = false,
}: FormFieldProps) {
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {optional && <span className={styles.optional}>(optional)</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        required={required}
        className={styles.input}
      />
    </div>
  );
}