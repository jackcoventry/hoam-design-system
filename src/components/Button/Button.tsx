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
  /** Adds custom class names to the rendered element. */
  className?: string | undefined;
  /** Visible button content. Used as the fallback accessible name for icon-only buttons. */
  children?: ReactNode | undefined;
  /** Optional icon rendered alongside the button content. */
  icon?: IconId | undefined;
  /** Controls whether the icon appears before or after the content. */
  iconPosition?: 'left' | 'right' | undefined;
  /** Visual treatment for the button. */
  variant?: ButtonVariantTypes | undefined;
  /** Renders the control as an icon-only button or link. */
  iconOnly?: boolean | undefined;
  /** Accessible name override, recommended for icon-only buttons without text children. */
  'aria-label'?: string | undefined;
  /** Compact size used in denser layouts. */
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
  /** Destination for custom link implementations. */
  href: string;
  /** Adds custom class names to the rendered link. */
  className?: string | undefined;
  /** Visible link content. */
  children?: ReactNode | undefined;
  /** Link target passed through to the rendered link component. */
  target?: HTMLAttributeAnchorTarget | undefined;
  /** Relationship attribute, automatically defaulted for `_blank` links when omitted. */
  rel?: string | undefined;
  /** Click handler for custom link implementations. */
  onClick?: MouseEventHandler<HTMLElement> | undefined;
  /** Accessible name override for icon-only links. */
  'aria-label'?: string | undefined;
  /** Internal attribute passed to custom link components so Button styles can position the icon correctly. */
  'data-icon-position'?: 'left' | 'right' | undefined;
  /** Internal attribute passed to custom link components so Button styles can apply the selected visual variant. */
  'data-variant'?: 'primary' | 'secondary' | 'tertiary' | undefined;
  /** Internal attribute passed to custom link components so Button styles can apply the selected size. */
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

  return clone;
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
