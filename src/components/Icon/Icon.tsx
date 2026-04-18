import iconsSpriteUrl from '@/assets/icons/icons.svg';
import type { IconId } from '@/design-tokens/icons';

export type IconProps = {
  id: IconId;
  className?: string | undefined;
  size?: string | number;
  'aria-label'?: string;
};

export function Icon({
  id,
  className,
  size = '1.25em',
  'aria-label': ariaLabel,
}: Readonly<IconProps>) {
  const isDecorative = !ariaLabel;

  return (
    <svg
      className={className}
      width={size}
      height={size}
      fill="currentColor"
      {...(isDecorative ? { 'aria-hidden': true } : { role: 'img', 'aria-label': ariaLabel })}
    >
      <use
        href={`${iconsSpriteUrl}#${id}`}
        xlinkHref={`${iconsSpriteUrl}#${id}`}
      />
    </svg>
  );
}
