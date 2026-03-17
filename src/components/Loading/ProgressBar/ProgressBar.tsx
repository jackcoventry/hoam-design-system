import styles from './ProgressBar.module.css';

export interface ProgressBarProps {
  value: number;
  min?: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  className?: string;
  valueLabelFormat?: (percentage: number, value: number) => string;
}

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ');
}

export function ProgressBar({
  value,
  min = 0,
  max = 100,
  label = 'Loading progress',
  showValue = true,
  className,
  valueLabelFormat,
}: Readonly<ProgressBarProps>) {
  const safeRange = max - min;
  const clampedValue = Math.min(Math.max(value, min), max);
  const percentage = safeRange <= 0 ? 0 : ((clampedValue - min) / safeRange) * 100;
  const valueText = valueLabelFormat
    ? valueLabelFormat(percentage, clampedValue)
    : `${Math.round(percentage)}%`;

  return (
    <div className={cx(styles.root, className)}>
      <div
        className={styles.track}
        role="progressbar"
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={clampedValue}
        aria-valuetext={valueText}
      >
        <div
          className={styles.fill}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {showValue ? (
        <span
          className={styles.value}
          aria-hidden="true"
        >
          {valueText}
        </span>
      ) : null}
    </div>
  );
}
