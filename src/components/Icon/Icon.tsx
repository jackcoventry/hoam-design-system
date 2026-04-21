import iconsSpriteUrl from '@/assets/icons/icons.svg';
import type { IconId } from '@/design-tokens/icons';

export type IconProps = {
  /** Icon token id from the generated icon sprite. */
  id: IconId;
  /** Adds custom class names to the SVG element. */
  className?: string | undefined;
  /** Width and height of the icon. */
  size?: string | number;
  /** Accessible name for non-decorative icons. */
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
