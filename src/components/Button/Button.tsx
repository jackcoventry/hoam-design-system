import clsx from 'clsx';
import React from 'react';
import './Button.css';

type ButtonProps = {
  className?: string;
  children?: React.ReactNode;
  icon?: string;
  iconPosition?: 'left' | 'right';
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  iconOnly?: boolean;
  ariaLabel?: string;
  type?: 'button' | 'submit' | 'reset';
};

const Button = ({
  children,
  className = '',
  onClick,
  icon,
  iconPosition = 'right',
  variant = 'primary',
  disabled = false,
  iconOnly = false,
  ariaLabel,
  type = 'button',
  ...rest
}: ButtonProps) => {
  const classes = clsx('hoam-button', className);

  // Fallback: if ariaLabel is not provided and iconOnly is true, try to use children as string
  let computedAriaLabel = ariaLabel;
  if (!ariaLabel && iconOnly && typeof children === 'string') {
    computedAriaLabel = children;
  }

  return (
    <button
      className={classes}
      data-icon-position={iconPosition}
      data-variant={variant}
      onClick={onClick}
      aria-label={computedAriaLabel}
      type={type}
      {...(disabled ? { disabled: true } : {})}
      {...rest}
    >
      {children && !iconOnly && <span className="hoam-button__content">{children}</span>}
      {icon && (
        <span className="hoam-button__icon">
          <svg
            className="icon"
            width="1.25em"
            height="1.25em"
            fill="currentColor"
          >
            <use xlinkHref={`/icons/icons.svg#${icon}`} />
          </svg>
        </span>
      )}
    </button>
  );
};

export { Button };
