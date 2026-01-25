import styles from './radio-pills.module.css';

interface RadioPillOption<T extends string> {
    value: T;
    label: string;
}

interface RadioPillsProps<T extends string> {
    name: string;
    options: RadioPillOption<T>[];
    value: T | '';
    onChange: (value: T) => void;
    label?: string;
    required?: boolean;
    error?: string;
}

export function RadioPills<T extends string>({
    name,
    options,
    value,
    onChange,
    label,
    required,
    error,
}: RadioPillsProps<T>) {
    return (
        <div className={styles.container}>
            {label && (
                <span className={styles.label}>
                    {label} {required && '*'}
                </span>
            )}
            <div className={styles.pillGroup} role="radiogroup" aria-label={label}>
                {options.map((option) => (
                    <label
                        key={option.value}
                        className={`${styles.pill} ${value === option.value ? styles.active : ''}`}
                    >
                        <input
                            type="radio"
                            name={name}
                            value={option.value}
                            checked={value === option.value}
                            onChange={() => onChange(option.value)}
                            className={styles.input}
                        />
                        <span className={styles.text}>{option.label}</span>
                    </label>
                ))}
            </div>
            {error && <span className={styles.error}>{error}</span>}
        </div>
    );
}
