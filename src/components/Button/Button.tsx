import React, { type AnchorHTMLAttributes, type ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

import styles from '@/components/Button/Button.module.css';
import utils from '@/components/Common/Util.module.css';

type CommonProps = {
  className?: string | undefined;
  children?: React.ReactNode;
  icon?: string;
  iconPosition?: 'left' | 'right';
  variant?: 'primary' | 'secondary' | 'tertiary';
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
  ButtonHTMLAttributes<HTMLButtonElement>,
  'type' | 'onClick' | 'disabled' | 'className' | 'children' | 'aria-label'
>;

type AnchorOnlyProps = {
  as: 'a';
  href: string;
  target?: React.HTMLAttributeAnchorTarget;
  rel?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  type?: never;
  disabled?: never;
} & Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
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

    const classes = clsx(styles.root, utils.focus, className);

    let computedAriaLabel = ariaLabel;

    if (!computedAriaLabel && iconOnly && typeof children === 'string') {
      computedAriaLabel = children;
    }

    if (props.as === 'a') {
      const { href, target, rel, ...anchorRest } = rest as AnchorOnlyProps;
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
          {children && !iconOnly ? <span className={styles.content}>{children}</span> : null}

          {icon ? (
            <span className={styles.icon}>
              <svg
                className="icon"
                width="1.25em"
                height="1.25em"
                fill="currentColor"
                aria-hidden="true"
              >
                <use xlinkHref={`/icons/icons.svg#${icon}`} />
              </svg>
            </span>
          ) : null}
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
        {children && !iconOnly ? <span className={styles.content}>{children}</span> : null}

        {icon ? (
          <span className={styles.icon}>
            <svg
              className="icon"
              width="1.25em"
              height="1.25em"
              fill="currentColor"
              aria-hidden="true"
            >
              <use xlinkHref={`/icons/icons.svg#${icon}`} />
            </svg>
          </span>
        ) : null}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
