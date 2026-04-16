import {
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type ComponentType,
  forwardRef,
  type ForwardRefExoticComponent,
  type HTMLAttributeAnchorTarget,
  type MouseEventHandler,
  type ReactNode,
  type Ref,
  type RefAttributes,
} from 'react';
import clsx from 'clsx';

import { Icon } from '@/components/Icon';
import { IconId } from '@/design-tokens/icons';

import styles from '@/components/Button/Button.module.css';
import utils from '@/styles/Util.module.css';

export const ButtonVariants = ['primary', 'secondary', 'tertiary'] as const;
export type ButtonVariantTypes = (typeof ButtonVariants)[number];

type CommonProps = {
  className?: string | undefined;
  children?: ReactNode | undefined;
  icon?: IconId | undefined;
  iconPosition?: 'left' | 'right' | undefined;
  variant?: ButtonVariantTypes | undefined;
  iconOnly?: boolean | undefined;
  'aria-label'?: string | undefined;
  size?: 'default' | 'small' | undefined;
};

type ButtonElementProps = {
  as?: 'button' | undefined;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'as' | 'className' | 'children' | 'aria-label'>;

type AnchorElementProps = {
  as: 'a';
  href: string;
  type?: never;
  disabled?: never;
} & Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'as' | 'className' | 'children' | 'aria-label' | 'href' | 'type'
>;

export type LinkComponentProps = {
  href: string;
  className?: string | undefined;
  children?: ReactNode | undefined;
  target?: HTMLAttributeAnchorTarget | undefined;
  rel?: string | undefined;
  onClick?: MouseEventHandler<HTMLElement> | undefined;
  'aria-label'?: string | undefined;
  'data-icon-position'?: 'left' | 'right' | undefined;
  'data-variant'?: 'primary' | 'secondary' | 'tertiary' | undefined;
  'data-size'?: 'default' | 'small' | undefined;
};

type LinkComponentType =
  | ComponentType<LinkComponentProps>
  | ForwardRefExoticComponent<LinkComponentProps & RefAttributes<HTMLAnchorElement>>;

type CustomLinkElementProps = {
  as: LinkComponentType;
  href: string;
  target?: HTMLAttributeAnchorTarget | undefined;
  rel?: string | undefined;
  onClick?: MouseEventHandler<HTMLElement> | undefined;
  type?: never;
  disabled?: never;
};

type ElementProps = ButtonElementProps | AnchorElementProps | CustomLinkElementProps;

export type ButtonProps = CommonProps & ElementProps;

type ButtonContentProps = {
  children?: ReactNode | undefined;
  icon?: string | undefined;
  iconOnly?: boolean | undefined;
};

function isAnchorElementProps(props: ElementProps): props is AnchorElementProps {
  return props.as === 'a';
}

function isCustomLinkElementProps(props: ElementProps): props is CustomLinkElementProps {
  return props.as !== undefined && props.as !== 'button' && props.as !== 'a';
}

function getSafeRel(
  target: HTMLAttributeAnchorTarget | undefined,
  rel: string | undefined
): string | undefined {
  return target === '_blank' ? (rel ?? 'noopener noreferrer') : rel;
}

function omitKeys<T extends object, const K extends readonly (keyof T)[]>(
  obj: T,
  keys: K
): Omit<T, K[number]> {
  const clone = { ...obj };

  for (const key of keys) {
    delete (clone as Record<PropertyKey, unknown>)[key];
  }

  return clone as Omit<T, K[number]>;
}

function ButtonContent({ children, icon, iconOnly = false }: Readonly<ButtonContentProps>) {
  const hasContent = children !== null && children !== undefined;

  return (
    <>
      {!iconOnly && hasContent ? <span className={styles.content}>{children}</span> : null}

      {icon ? (
        <span className={styles.icon}>
          <Icon id={icon as IconId} />
        </span>
      ) : null}
    </>
  );
}

type ButtonComponent = {
  (props: Readonly<CommonProps & ButtonElementProps> & RefAttributes<HTMLButtonElement>): ReactNode;
  (props: Readonly<CommonProps & AnchorElementProps> & RefAttributes<HTMLAnchorElement>): ReactNode;
  (
    props: Readonly<CommonProps & CustomLinkElementProps> & RefAttributes<HTMLAnchorElement>
  ): ReactNode;
};

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, Readonly<ButtonProps>>(
  function ButtonRoot(props, ref) {
    const {
      className = '',
      children,
      icon,
      iconPosition = 'right',
      variant = 'primary',
      iconOnly = false,
      size = 'default',
      'aria-label': ariaLabel,
      ...elementProps
    } = props;

    const classes = clsx(styles.root, utils.focus, className);

    let computedAriaLabel = ariaLabel;

    if (!computedAriaLabel && iconOnly && typeof children === 'string') {
      computedAriaLabel = children;
    }

    const commonVisualProps = {
      className: classes,
      'data-icon-position': iconPosition,
      'data-variant': variant,
      'data-size': size,
      'aria-label': computedAriaLabel,
    };

    const content = (
      <ButtonContent
        icon={icon}
        iconOnly={iconOnly}
      >
        {children}
      </ButtonContent>
    );

    if (isAnchorElementProps(elementProps)) {
      const relSafe = getSafeRel(elementProps.target, elementProps.rel);
      const anchorRest = omitKeys(elementProps, ['as', 'href', 'target', 'rel'] as const);

      return (
        <a
          {...anchorRest}
          {...commonVisualProps}
          href={elementProps.href}
          target={elementProps.target}
          rel={relSafe}
          ref={ref as Ref<HTMLAnchorElement>}
        >
          {content}
        </a>
      );
    }

    if (isCustomLinkElementProps(elementProps)) {
      const LinkComponent = elementProps.as;
      const relSafe = getSafeRel(elementProps.target, elementProps.rel);

      return (
        <LinkComponent
          {...commonVisualProps}
          href={elementProps.href}
          target={elementProps.target}
          rel={relSafe}
          onClick={elementProps.onClick}
          ref={ref as Ref<HTMLAnchorElement>}
        >
          {content}
        </LinkComponent>
      );
    }

    const buttonRest = omitKeys(elementProps, ['as', 'type'] as const);
    const type = elementProps.type ?? 'button';

    return (
      <button
        {...buttonRest}
        {...commonVisualProps}
        type={type}
        ref={ref as Ref<HTMLButtonElement>}
      >
        {content}
      </button>
    );
  }
) as ButtonComponent;

export { Button };
