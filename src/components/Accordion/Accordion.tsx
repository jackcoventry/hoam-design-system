import React, {
  createContext,
  useContext,
  useState,
  useId,
  useMemo,
  ReactNode,
  ReactElement,
  KeyboardEvent,
  forwardRef,
  createRef,
  ButtonHTMLAttributes,
  HTMLAttributes,
} from "react";
import { ACCORDION } from "@/constants/errors";
import { KEYS } from "@/constants/keys";

export interface AccordionProps {
  allowMultiple?: boolean;
  defaultOpenIds?: string[];
  openIds?: string[];
  onChange?: (openIds: string[]) => void;
  className?: string;
  children: ReactNode;
}

export interface AccordionItemProps {
  id: string;
  index?: number;
  className?: string;
  children: ReactNode;
}

interface AccordionContextType {
  openIds: string[];
  toggle: (id: string) => void;
  allowMultiple: boolean;
  baseId: string;
  headerRefs: React.RefObject<HTMLButtonElement>[];
  total: number;
}

const AccordionContext = createContext<AccordionContextType | null>(null);

/**
 * Main Accordion container component
 */

export const Accordion: React.FC<AccordionProps> = ({
  allowMultiple = false,
  className = "",
  children,
  defaultOpenIds = [],
  openIds: controlledOpenIds,
  onChange,
}) => {
  const items = React.Children.toArray(children).filter(
    (c): c is ReactElement<AccordionItemProps> =>
      React.isValidElement(c) && c.type === AccordionItem
  );
  const total = items.length;
  const allIds = items.map((item) => item.props.id);
  const headerRefs = useMemo(
    () => Array.from({ length: total }, () => createRef<HTMLButtonElement>()),
    [total]
  );
  const baseId = useId();
  const isControlled = controlledOpenIds !== undefined;

  const initialOpen = useMemo<string[]>(() => {
    if (isControlled) return controlledOpenIds!;
    return defaultOpenIds;
  }, [isControlled, controlledOpenIds, defaultOpenIds]);

  const [internalOpenIds, setInternalOpenIds] = useState<string[]>(initialOpen);
  const openIds = isControlled ? controlledOpenIds! : internalOpenIds;

  const [liveMessage, setLiveMessage] = useState<string>("");

  const updateOpenIds = (ids: string[], message?: string) => {
    if (isControlled) {
      onChange?.(ids);
    } else {
      setInternalOpenIds(ids);
    }
    if (message) {
      setLiveMessage(message);
    }
  };

  const toggle = (id: string) => {
    const isOpen = openIds.includes(id);
    const next = isOpen
      ? openIds.filter((i) => i !== id)
      : allowMultiple
        ? [...openIds, id]
        : [id];
    updateOpenIds(next);
  };

  return items.length > 0 ? (
    <AccordionContext.Provider
      value={{ openIds, toggle, allowMultiple, baseId, headerRefs, total }}
    >
      <div className={className}>
        <div aria-live="polite" className="sr-only">
          {liveMessage}
        </div>

        <div
          role="group"
          aria-label="Accordion controls"
          className="accordion-controls mb-2 flex gap-2"
        >
          <button
            type="button"
            onClick={() => updateOpenIds(allIds, "All sections expanded")}
            aria-label="Expand all sections"
          >
            Expand All
          </button>
          <button
            type="button"
            onClick={() => updateOpenIds([], "All sections collapsed")}
            aria-label="Collapse all sections"
          >
            Collapse All
          </button>
        </div>
        {items.map((child, idx) => React.cloneElement(child, { index: idx }))}
      </div>
    </AccordionContext.Provider>
  ) : null;
};

Accordion.displayName = "Accordion";

export default Accordion;

/**
 * Individual AccordionItem component
 */
export const AccordionItem: React.FC<AccordionItemProps> = ({
  id,
  index = 0,
  className = "",
  children,
}) => {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error(ACCORDION.ITEM_MUST_BE_WITHIN_ACCORDION);
  const { openIds, toggle, baseId, headerRefs, total } = ctx;
  const isOpen = openIds.includes(id);

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const key = e.key;
    let nextIndex: number;
    switch (key) {
      case KEYS.ARROW_DOWN:
        e.preventDefault();
        nextIndex = (index + 1) % total;
        headerRefs[nextIndex].current?.focus();
        break;
      case KEYS.ARROW_UP:
        e.preventDefault();
        nextIndex = (index - 1 + total) % total;
        headerRefs[nextIndex].current?.focus();
        break;
      case KEYS.HOME:
        e.preventDefault();
        headerRefs[0].current?.focus();
        break;
      case KEYS.END:
        e.preventDefault();
        headerRefs[total - 1].current?.focus();
        break;
      case KEYS.ENTER:
      case KEYS.SPACE:
        e.preventDefault();
        toggle(id);
        break;
      default:
        break;
    }
  };

  const headerChild = React.Children.toArray(children).find(
    (c) => React.isValidElement(c) && c.type === AccordionHeader
  ) as ReactElement<ButtonHTMLAttributes<HTMLButtonElement>>;
  const panelChild = React.Children.toArray(children).find(
    (c) => React.isValidElement(c) && c.type === AccordionPanel
  ) as ReactElement<HTMLAttributes<HTMLDivElement>>;
  if (!headerChild || !panelChild) {
    throw new Error(ACCORDION.ITEM_MUST_CONTAINER_HEADER_AND_PANEL);
  }

  const { children: headerContent, ...headerProps } = headerChild.props;
  const { children: panelContent, ...panelProps } = panelChild.props;
  const headerId = `${baseId}-header-${id}`;
  const panelId = `${baseId}-panel-${id}`;

  return (
    <div className={className}>
      <h3>
        <AccordionHeader
          id={headerId}
          aria-controls={panelId}
          aria-expanded={isOpen}
          onClick={() => toggle(id)}
          onKeyDown={onKeyDown}
          ref={headerRefs[index]}
          {...headerProps}
        >
          {headerContent}
        </AccordionHeader>
      </h3>
      <AccordionPanel
        id={panelId}
        aria-labelledby={headerId}
        hidden={!isOpen}
        {...panelProps}
      >
        {panelContent}
      </AccordionPanel>
    </div>
  );
};
AccordionItem.displayName = "AccordionItem";

/**
 * Header sub-component
 */
export const AccordionHeader = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement>
>((props, ref) => <button ref={ref} type="button" {...props} />);
AccordionHeader.displayName = "AccordionHeader";

/**
 * Panel sub-component
 */
export const AccordionPanel: React.FC<HTMLAttributes<HTMLDivElement>> = (
  props
) => <div role="region" {...props} />;

AccordionPanel.displayName = "AccordionPanel";
