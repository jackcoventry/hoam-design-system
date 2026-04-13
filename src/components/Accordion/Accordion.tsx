import {
  Children,
  createContext,
  HTMLAttributes,
  isValidElement,
  PropsWithChildren,
  ReactElement,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import clsx from 'clsx';

import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { useMessages } from '@/hooks/useMessages';
import { logger } from '@/utils/logger';

import styles from '@/components/Accordion/Accordion.module.css';
import bodyText from '@/styles/BodyText.module.css';

export interface AccordionProps {
  allowMultiple?: boolean;
  defaultOpenIds?: string[];
  openIds?: string[];
  onChange?: (openIds: string[]) => void;
  className?: string | undefined;
  children: ReactNode;
  showToggleAll?: boolean;
  collapseLabel?: string;
  expandLabel?: string;
}

export interface AccordionItemProps {
  id: string;
  children: ReactNode;
  className?: string;
}

export interface AccordionHeaderProps {
  children: ReactNode;
  className?: string | undefined;
  disabled?: boolean;
}

export interface AccordionPanelProps {
  children: ReactNode;
  className?: string;
}

interface AccordionContextType {
  openIds: string[];
  toggle: (id: string) => void;
}

type AccordionHeaderElement = ReactElement<React.ComponentProps<typeof AccordionHeader>>;
type AccordionPanelElement = ReactElement<React.ComponentProps<typeof AccordionPanel>>;

const AccordionContext = createContext<AccordionContextType | null>(null);

function useAccordionContext() {
  const ctx = useContext(AccordionContext);

  logger.invariant(ctx, 'AccordionItem must be used within Accordion');

  return ctx;
}

function isAccordionItemElement(child: ReactNode): child is ReactElement<AccordionItemProps> {
  return isValidElement(child) && child.type === AccordionItem;
}

function getAccordionItemParts(children: ReactNode): {
  header: AccordionHeaderElement;
  panel: AccordionPanelElement;
} {
  const childArray = Children.toArray(children);

  logger.invariant(
    childArray.length === 2,
    'AccordionItem must contain exactly two children: <AccordionHeader /> and <AccordionPanel />'
  );

  const [headerChild, panelChild] = childArray;

  logger.invariant(
    isValidElement(headerChild) && headerChild.type === AccordionHeader,
    'The first child of AccordionItem must be <AccordionHeader />'
  );

  logger.invariant(
    isValidElement(panelChild) && panelChild.type === AccordionPanel,
    'The second child of AccordionItem must be <AccordionPanel />'
  );

  return {
    header: headerChild as AccordionHeaderElement,
    panel: panelChild as AccordionPanelElement,
  };
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
        .filter(isAccordionItemElement)
        .map((child) => child.props.id),
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

Accordion.displayName = 'Accordion';

export function AccordionItem({ id, children, className }: Readonly<AccordionItemProps>) {
  const { openIds, toggle } = useAccordionContext();
  const isOpen = openIds.includes(id);

  const { header, panel } = getAccordionItemParts(children);
  const isDisabled = header.props.disabled ?? false;

  const headerId = `accordion-header-${id}`;
  const panelId = `accordion-panel-${id}`;

  return (
    <div
      className={clsx(styles.item, className)}
      data-state={isOpen ? 'open' : 'closed'}
      data-disabled={isDisabled ? 'true' : 'false'}
    >
      <div className={styles.itemTitle}>
        <button
          id={headerId}
          type="button"
          aria-controls={panelId}
          aria-expanded={isOpen}
          disabled={isDisabled}
          onClick={() => toggle(id)}
          className={clsx(styles.itemTitleButton, header.props.className)}
        >
          <span className={styles.itemTitleText}>{header.props.children}</span>

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
        className={clsx(styles.panel, panel.props.className)}
        data-open={isOpen ? 'true' : 'false'}
      >
        <div className={clsx(styles.panelInner, bodyText.root)}>{panel.props.children}</div>
      </section>
    </div>
  );
}

AccordionItem.displayName = 'AccordionItem';

export function AccordionHeader({ children }: Readonly<AccordionHeaderProps>) {
  return <>{children}</>;
}

AccordionHeader.displayName = 'AccordionHeader';

export function AccordionPanel({
  children,
}: Readonly<PropsWithChildren<AccordionPanelProps & HTMLAttributes<HTMLDivElement>>>) {
  return <>{children}</>;
}

AccordionPanel.displayName = 'AccordionPanel';
