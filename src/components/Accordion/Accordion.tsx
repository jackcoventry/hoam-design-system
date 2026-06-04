import {
  Children,
  createContext,
  isValidElement,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import clsx from 'clsx';

import { Button } from '@/components/Button';
import { BodyText } from '@/components/Common/BodyText/BodyText';
import { Icon } from '@/components/Icon';
import { useMessages } from '@/hooks/useMessages';
import { logger } from '@/utils/logger';

import styles from '@/components/Accordion/Accordion.module.css';

export interface AccordionProps {
  /** Allows multiple accordion items to stay open at once. */
  allowMultiple?: boolean;
  /** Uncontrolled open item ids used on initial render. */
  defaultOpenIds?: string[];
  /** Controlled open item ids. */
  openIds?: string[];
  /** Called when the open item ids change. */
  onChange?: (openIds: string[]) => void;
  /** Adds custom class names to the accordion root. */
  className?: string | undefined;
  /** Accordion items and their panels. */
  children: ReactNode;
  /** Shows the expand/collapse-all control when multiple items are allowed. */
  showToggleAll?: boolean;
}

export interface AccordionItemProps {
  /** Stable identifier used for button and panel relationships. */
  id: string;
  /** Header content shown inside the item trigger button. */
  title: ReactNode;
  /** Panel content shown when the item is open. */
  children: ReactNode;
  /** Adds custom class names to the item wrapper. */
  className?: string | undefined;
  /** Adds custom class names to the trigger button. */
  triggerClassName?: string | undefined;
  /** Adds custom class names to the panel wrapper. */
  panelClassName?: string | undefined;
  /** Prevents the item from being toggled. */
  disabled?: boolean;
}

interface AccordionContextType {
  openIds: string[];
  toggle: (id: string) => void;
}

const AccordionContext = createContext<AccordionContextType | null>(null);

function useAccordionContext() {
  const ctx = useContext(AccordionContext);

  logger.invariant(ctx, 'AccordionItem must be used within Accordion');

  return ctx;
}

function getAccordionItemId(child: ReactNode): string | null {
  if (!isValidElement<{ id?: unknown }>(child) || typeof child.props.id !== 'string') {
    return null;
  }

  return child.props.id;
}

export function Accordion({
  allowMultiple = false,
  defaultOpenIds = [],
  openIds: controlledOpenIds,
  onChange,
  className = '',
  children,
  showToggleAll = true,
}: Readonly<AccordionProps>) {
  const t = useMessages('accordion');

  const isControlled = controlledOpenIds !== undefined;
  const [internalOpenIds, setInternalOpenIds] = useState<string[]>(() => defaultOpenIds);

  const openIds = isControlled ? controlledOpenIds : internalOpenIds;

  const itemIds = useMemo(
    () =>
      Children.toArray(children)
        .map(getAccordionItemId)
        .filter((id) => id !== null),
    [children]
  );

  const updateOpenIds = useCallback(
    (ids: string[]) => {
      if (isControlled) {
        onChange?.(ids);
      } else {
        setInternalOpenIds(ids);
      }
    },
    [isControlled, onChange]
  );

  const toggle = useCallback(
    (id: string) => {
      const isOpen = openIds.includes(id);

      let next: string[];

      if (isOpen) {
        next = openIds.filter((openId) => openId !== id);
      } else {
        next = allowMultiple ? [...openIds, id] : [id];
      }

      updateOpenIds(next);
    },
    [allowMultiple, openIds, updateOpenIds]
  );

  const allExpanded = itemIds.length > 0 && itemIds.every((id) => openIds.includes(id));

  const value = useMemo(() => ({ openIds, toggle }), [openIds, toggle]);

  return (
    <AccordionContext.Provider value={value}>
      <div className={clsx(styles.root, className)}>
        {allowMultiple && showToggleAll && itemIds.length > 1 && (
          <div className={styles.header}>
            <Button
              type="button"
              className={styles.toggleAll}
              onClick={() => updateOpenIds(allExpanded ? [] : itemIds)}
              variant="primary"
              size="small"
            >
              {allExpanded ? t.collapse : t.expand}
            </Button>
          </div>
        )}

        {children}
      </div>
    </AccordionContext.Provider>
  );
}

export function AccordionItem({
  id,
  title,
  children,
  className,
  triggerClassName,
  panelClassName,
  disabled = false,
}: Readonly<AccordionItemProps>) {
  const { openIds, toggle } = useAccordionContext();
  const isOpen = openIds.includes(id);

  const headerId = `accordion-header-${id}`;
  const panelId = `accordion-panel-${id}`;

  return (
    <div
      className={clsx(styles.item, className)}
      data-state={isOpen ? 'open' : 'closed'}
      data-disabled={disabled ? 'true' : 'false'}
    >
      <div className={styles.itemTitle}>
        <button
          id={headerId}
          type="button"
          aria-controls={panelId}
          aria-expanded={isOpen}
          disabled={disabled}
          onClick={() => toggle(id)}
          className={clsx(styles.itemTitleButton, triggerClassName)}
        >
          <span className={styles.itemTitleText}>{title}</span>

          <span
            className={styles.icon}
            aria-hidden="true"
          >
            <Icon
              id={isOpen ? 'caret-down' : 'caret-right'}
              size="0.5em"
            />
          </span>
        </button>
      </div>

      <section
        id={panelId}
        aria-labelledby={headerId}
        aria-hidden={!isOpen}
        className={clsx(styles.panel, panelClassName)}
        data-open={isOpen ? 'true' : 'false'}
      >
        <div className={styles.panelInner}>
          <BodyText>{children}</BodyText>
        </div>
      </section>
    </div>
  );
}
