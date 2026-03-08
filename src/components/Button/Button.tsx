import clsx from 'clsx';
import React from 'react';

import './Button.css';

// Common props for both button and anchor
type CommonProps = {
  className?: string;
  children?: React.ReactNode;
  icon?: string;
  iconPosition?: 'left' | 'right';
  variant?: 'primary' | 'secondary';
  iconOnly?: boolean;
  ariaLabel?: string;
  size?: 'default' | 'small';
};

type ButtonOnlyProps = {
  as?: 'button';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
} & Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'type' | 'onClick' | 'disabled' | 'className' | 'children' | 'aria-label'
>;

type AnchorOnlyProps = {
  as: 'a';
  href: string;
  target?: React.HTMLAttributeAnchorTarget;
  rel?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  // Disallow button-only props on anchors
  type?: never;
  disabled?: never;
} & Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  'onClick' | 'className' | 'children' | 'aria-label'
>;

export type ButtonProps = CommonProps & (ButtonOnlyProps | AnchorOnlyProps);

const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, Readonly<ButtonProps>>(
  function ButtonRoot(props, ref) {
    const {
      className = '',
      children,
      icon,
      iconPosition = 'right',
      variant = 'primary',
      iconOnly = false,
      ariaLabel,
      size = 'default',
      ...rest
    } = props;

    const classes = clsx('hoam-button', className);

    // If iconOnly and no ariaLabel, fall back to string children
    let computedAriaLabel = ariaLabel;
    if (!computedAriaLabel && iconOnly && typeof children === 'string') {
      computedAriaLabel = children;
    }

    if (props.as === 'a') {
      const { href, target, rel, onClick, ...anchorRest } = rest as AnchorOnlyProps;
      const relSafe = target === '_blank' ? rel || 'noopener noreferrer' : rel;

      return (
        <a
          className={classes}
          data-icon-position={iconPosition}
          data-variant={variant}
          data-size={size}
          aria-label={computedAriaLabel}
          href={href}
          target={target}
          rel={relSafe}
          ref={ref as React.Ref<HTMLAnchorElement>}
          {...anchorRest}
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
        </a>
      );
    }

    const { type = 'button', disabled = false, onClick, ...buttonRest } = rest as ButtonOnlyProps;

    return (
      <button
        className={classes}
        data-icon-position={iconPosition}
        data-variant={variant}
        data-size={size}
        onClick={onClick}
        aria-label={computedAriaLabel}
        type={type}
        disabled={disabled}
        ref={ref as React.Ref<HTMLButtonElement>}
        {...buttonRest}
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
  }
);

export { Button };
