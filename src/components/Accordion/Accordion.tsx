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

// Props for <Accordion>
export interface AccordionProps {
  allowMultiple?: boolean;
  defaultOpenIds?: string[];
  openIds?: string[];
  onChange?: (openIds: string[]) => void;
  className?: string;
  children: ReactNode;
}

// Props for each <AccordionItem>
export interface AccordionItemProps {
  id: string;
  index?: number;
  className?: string;
  children: ReactNode;
}

// Internal context
interface AccordionContextType {
  openIds: string[];
  toggle: (id: string) => void;
  allowMultiple: boolean;
  baseId: string;
  headerRefs: React.RefObject<HTMLButtonElement>[];
  total: number;
}
const AccordionContext = createContext<AccordionContextType | null>(null);

// Accordion container
export const Accordion: React.FC<AccordionProps> = ({
  allowMultiple = false,
  defaultOpenIds,
  openIds: controlledOpenIds,
  onChange,
  className = "",
  children,
}) => {
  const items = React.Children.toArray(children).filter(
    (c): c is ReactElement<AccordionItemProps> =>
      React.isValidElement(c) && c.type === AccordionItem
  );
  const total = items.length;
  const headerRefs = useMemo(
    () => Array.from({ length: total }, () => createRef<HTMLButtonElement>()),
    [total]
  );
  const baseId = useId();
  const isControlled = controlledOpenIds !== undefined;

  const initialOpen = React.useMemo<string[]>(() => {
    if (isControlled) return controlledOpenIds!;
    if (defaultOpenIds && defaultOpenIds.length) return defaultOpenIds;
    return [];
  }, [isControlled, controlledOpenIds, defaultOpenIds]);

  const [internalOpenIds, setInternalOpenIds] = useState<string[]>(initialOpen);
  const openIds = isControlled ? controlledOpenIds! : internalOpenIds;

  const update = (ids: string[]) => {
    if (isControlled) onChange?.(ids);
    else setInternalOpenIds(ids);
  };

  const toggle = (id: string) => {
    const isOpen = openIds.includes(id);
    const next = isOpen
      ? openIds.filter((i) => i !== id)
      : allowMultiple
        ? [...openIds, id]
        : [id];
    update(next);
  };

  return (
    <AccordionContext.Provider
      value={{ openIds, toggle, allowMultiple, baseId, headerRefs, total }}
    >
      <div className={className}>
        {items.map((child, idx) => React.cloneElement(child, { index: idx }))}
      </div>
    </AccordionContext.Provider>
  );
};

Accordion.displayName = "Accordion";
export default Accordion;

// AccordionItem
export const AccordionItem: React.FC<AccordionItemProps> = ({
  id,
  index = 0,
  className = "",
  children,
}) => {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error("AccordionItem must be used within Accordion");
  const { openIds, toggle, baseId, headerRefs, total } = ctx;
  const isOpen = openIds.includes(id);

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const key = e.key;
    let next: number;
    switch (key) {
      case "ArrowDown":
        e.preventDefault();
        next = (index + 1) % total;
        headerRefs[next].current?.focus();
        break;
      case "ArrowUp":
        e.preventDefault();
        next = (index - 1 + total) % total;
        headerRefs[next].current?.focus();
        break;
      case "Home":
        e.preventDefault();
        headerRefs[0].current?.focus();
        break;
      case "End":
        e.preventDefault();
        headerRefs[total - 1].current?.focus();
        break;
      case "Enter":
      case " ":
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
    throw new Error(
      "AccordionItem must contain AccordionHeader and AccordionPanel"
    );
  }

  const headerProps = headerChild.props;
  const panelProps = panelChild.props;
  const headerId = `${baseId}-head-${id}`;
  const panelId = `${baseId}-panel-${id}`;

  return (
    <div className={className}>
      <AccordionHeader
        id={headerId}
        aria-controls={panelId}
        aria-expanded={isOpen}
        onClick={() => toggle(id)}
        onKeyDown={onKeyDown}
        ref={headerRefs[index]}
        {...headerProps}
      >
        {headerProps.children}
      </AccordionHeader>
      <AccordionPanel
        id={panelId}
        aria-labelledby={headerId}
        hidden={!isOpen}
        {...panelProps}
      >
        {panelProps.children}
      </AccordionPanel>
    </div>
  );
};

AccordionItem.displayName = "AccordionItem";

// AccordionHeader
export const AccordionHeader = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement>
>((props, ref) => <button ref={ref} type="button" {...props} />);
AccordionHeader.displayName = "AccordionHeader";

// AccordionPanel
export const AccordionPanel: React.FC<HTMLAttributes<HTMLDivElement>> = (
  props
) => <div role="region" {...props} />;
AccordionPanel.displayName = "AccordionPanel";
