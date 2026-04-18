import { VisuallyHidden } from '@/components/Common/VisuallyHidden';
import { useMessages } from '@/hooks/useMessages';

import styles from '@/components/Form/PasswordStrengthMeter/PasswordStrengthMeter.module.css';

type StrengthLevel = 0 | 1 | 2 | 3 | 4;

export function calculatePasswordStrength(password: string): StrengthLevel {
  let score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++; // extra point for length
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score > 4) score = 4;
  return score as StrengthLevel;
}

type PasswordStrengthMeterProps = {
  strength: StrengthLevel;
};

export function PasswordStrengthMeter({ strength }: Readonly<PasswordStrengthMeterProps>) {
  const t = useMessages('password');

  const strengthLabel = (strength: StrengthLevel) => {
    switch (strength) {
      case 0:
        return t.strength0;
      case 1:
        return t.strength1;
      case 2:
        return t.strength2;
      case 3:
        return t.strength3;
      case 4:
        return t.strength4;
    }
  };

  const label = strengthLabel(strength);
  const segments = [0, 1, 2, 3] as const;

  return (
    <div className={styles.root}>
      <div
        className={styles.track}
        aria-hidden="true"
      >
        {segments.map((i) => {
          const active = strength > i;
          return (
            <div
              className={styles.segment}
              key={i}
              data-active={active}
              data-strength={i}
            />
          );
        })}
      </div>
      {strength ? (
        <VisuallyHidden>
          <div aria-live="polite">{label}</div>
        </VisuallyHidden>
      ) : null}
    </div>
  );
}
