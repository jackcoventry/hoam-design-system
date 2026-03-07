import './PasswordStrengthMeter.css';

type StrengthLevel = 0 | 1 | 2 | 3 | 4;

export function calculatePasswordStrength(password: string): StrengthLevel {
  let score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++; // extra point for length
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score > 4) score = 4;
  return score as StrengthLevel;
}

function strengthLabel(strength: StrengthLevel): string {
  switch (strength) {
    case 0:
      return 'Too weak';
    case 1:
      return 'Weak';
    case 2:
      return 'Fair';
    case 3:
      return 'Strong';
    case 4:
      return 'Very strong';
  }
}

type PasswordStrengthMeterProps = {
  strength: StrengthLevel;
};

function PasswordStrengthMeter({ strength }: Readonly<PasswordStrengthMeterProps>) {
  const label = strengthLabel(strength);
  const segments = [0, 1, 2, 3] as const;

  return (
    <div>
      <div
        className="hoam-password-strength__track"
        aria-hidden="true"
      >
        {segments.map((i) => {
          const active = strength > i;
          return (
            <div
              className="hoam-password-strength__segment"
              key={i}
              data-active={active}
              data-strength={i}
            />
          );
        })}
      </div>
      {strength ? (
        <div
          aria-live="polite"
          aria-hidden="true"
          className="sr-only"
        >
          {label}
        </div>
      ) : null}
    </div>
  );
}

export default PasswordStrengthMeter;
