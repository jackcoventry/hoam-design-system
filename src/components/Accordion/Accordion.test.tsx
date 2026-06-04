import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Accordion, AccordionItem } from '@/components/Accordion';

const mockUseMessages = vi.fn<
  (namespace: string) => {
    expand: string;
    collapse: string;
  }
>();

const mockInvariant = vi.fn((condition: unknown, message: string) => {
  if (!condition) {
    throw new Error(message);
  }
});

vi.mock('@/hooks/useMessages', () => ({
  useMessages: (namespace: string) => mockUseMessages(namespace),
}));

vi.mock('@/utils/logger', () => ({
  logger: {
    invariant: (condition: unknown, message: string) => mockInvariant(condition, message),
  },
}));

vi.mock('@/components/Button', () => ({
  Button: ({
    children,
    onClick,
    disabled,
    type,
    className,
    variant,
    size,
  }: {
    children: ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    className?: string;
    variant?: string;
    size?: string;
  }) => (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={className}
      data-variant={variant}
      data-size={size}
    >
      {children}
    </button>
  ),
}));

vi.mock('@/components/Common/BodyText/BodyText', () => ({
  BodyText: ({ children }: { children: ReactNode }) => (
    <div data-testid="body-text">{children}</div>
  ),
}));

vi.mock('@/components/Icon', () => ({
  Icon: ({ id, size }: { id: string; size?: string }) => (
    <span
      data-testid="icon"
      data-icon-id={id}
      data-size={size}
    />
  ),
}));

vi.mock('@/components/Accordion/Accordion.module.css', () => ({
  default: {
    root: 'root',
    header: 'header',
    toggleAll: 'toggleAll',
    item: 'item',
    itemTitle: 'itemTitle',
    itemTitleButton: 'itemTitleButton',
    itemTitleText: 'itemTitleText',
    icon: 'icon',
    panel: 'panel',
    panelInner: 'panelInner',
  },
}));

describe('Accordion', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUseMessages.mockReturnValue({
      expand: 'Expand all',
      collapse: 'Collapse all',
    });
  });

  function renderAccordion(props?: {
    allowMultiple?: boolean;
    defaultOpenIds?: string[];
    openIds?: string[];
    onChange?: (openIds: string[]) => void;
    className?: string;
    showToggleAll?: boolean;
  }) {
    return render(
      <Accordion {...props}>
        <AccordionItem id="one" title="First section">
          <p>First content</p>
        </AccordionItem>

        <AccordionItem id="two" title="Second section">
          <p>Second content</p>
        </AccordionItem>
      </Accordion>
    );
  }

  it('calls useMessages with the accordion namespace', () => {
    renderAccordion();

    expect(mockUseMessages).toHaveBeenCalledWith('accordion');
  });

  it('renders both accordion items', () => {
    renderAccordion();

    expect(screen.getByRole('button', { name: 'First section' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Second section' })).toBeInTheDocument();
    expect(screen.getByText('First content')).toBeInTheDocument();
    expect(screen.getByText('Second content')).toBeInTheDocument();
  });

  it('renders all items closed by default', () => {
    renderAccordion();

    const firstButton = screen.getByRole('button', { name: 'First section' });
    const secondButton = screen.getByRole('button', { name: 'Second section' });

    expect(firstButton).toHaveAttribute('aria-expanded', 'false');
    expect(secondButton).toHaveAttribute('aria-expanded', 'false');

    expect(screen.getByText('First content').closest('section')).toHaveAttribute(
      'aria-hidden',
      'true'
    );
    expect(screen.getByText('Second content').closest('section')).toHaveAttribute(
      'aria-hidden',
      'true'
    );
  });

  it('opens items from defaultOpenIds', () => {
    renderAccordion({ defaultOpenIds: ['one'] });

    const firstButton = screen.getByRole('button', { name: 'First section' });
    const secondButton = screen.getByRole('button', { name: 'Second section' });

    expect(firstButton).toHaveAttribute('aria-expanded', 'true');
    expect(secondButton).toHaveAttribute('aria-expanded', 'false');

    expect(screen.getByText('First content').closest('section')).toHaveAttribute(
      'aria-hidden',
      'false'
    );
    expect(screen.getByText('Second content').closest('section')).toHaveAttribute(
      'aria-hidden',
      'true'
    );
  });

  it('toggles an item open and closed in uncontrolled mode', () => {
    renderAccordion();

    const firstButton = screen.getByRole('button', { name: 'First section' });

    fireEvent.click(firstButton);
    expect(firstButton).toHaveAttribute('aria-expanded', 'true');

    fireEvent.click(firstButton);
    expect(firstButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('only allows one item open at a time by default', () => {
    renderAccordion();

    const firstButton = screen.getByRole('button', { name: 'First section' });
    const secondButton = screen.getByRole('button', { name: 'Second section' });

    fireEvent.click(firstButton);
    expect(firstButton).toHaveAttribute('aria-expanded', 'true');
    expect(secondButton).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(secondButton);
    expect(firstButton).toHaveAttribute('aria-expanded', 'false');
    expect(secondButton).toHaveAttribute('aria-expanded', 'true');
  });

  it('allows multiple items to be open when allowMultiple is true', () => {
    renderAccordion({ allowMultiple: true });

    const firstButton = screen.getByRole('button', { name: 'First section' });
    const secondButton = screen.getByRole('button', { name: 'Second section' });

    fireEvent.click(firstButton);
    fireEvent.click(secondButton);

    expect(firstButton).toHaveAttribute('aria-expanded', 'true');
    expect(secondButton).toHaveAttribute('aria-expanded', 'true');
  });

  it('renders the toggle-all button only when allowMultiple is true and there is more than one item', () => {
    renderAccordion({ allowMultiple: true });

    const toggleAll = screen.getByRole('button', { name: 'Expand all' });
    expect(toggleAll).toBeInTheDocument();
    expect(toggleAll).toHaveAttribute('data-variant', 'primary');
    expect(toggleAll).toHaveAttribute('data-size', 'small');
  });

  it('does not render the toggle-all button when allowMultiple is false', () => {
    renderAccordion({ allowMultiple: false });

    expect(screen.queryByRole('button', { name: 'Expand all' })).not.toBeInTheDocument();
  });

  it('does not render the toggle-all button when showToggleAll is false', () => {
    renderAccordion({ allowMultiple: true, showToggleAll: false });

    expect(screen.queryByRole('button', { name: 'Expand all' })).not.toBeInTheDocument();
  });

  it('does not render the toggle-all button when there is only one item', () => {
    render(
      <Accordion allowMultiple>
        <AccordionItem id="one" title="Only section">
          <p>Only content</p>
        </AccordionItem>
      </Accordion>
    );

    expect(screen.queryByRole('button', { name: 'Expand all' })).not.toBeInTheDocument();
  });

  it('expands all items when toggle-all is clicked', () => {
    renderAccordion({ allowMultiple: true });

    const toggleAll = screen.getByRole('button', { name: 'Expand all' });
    const firstButton = screen.getByRole('button', { name: 'First section' });
    const secondButton = screen.getByRole('button', { name: 'Second section' });

    fireEvent.click(toggleAll);

    expect(firstButton).toHaveAttribute('aria-expanded', 'true');
    expect(secondButton).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('button', { name: 'Collapse all' })).toBeInTheDocument();
  });

  it('collapses all items when all are expanded and toggle-all is clicked', () => {
    renderAccordion({ allowMultiple: true });

    fireEvent.click(screen.getByRole('button', { name: 'Expand all' }));
    fireEvent.click(screen.getByRole('button', { name: 'Collapse all' }));

    expect(screen.getByRole('button', { name: 'First section' })).toHaveAttribute(
      'aria-expanded',
      'false'
    );
    expect(screen.getByRole('button', { name: 'Second section' })).toHaveAttribute(
      'aria-expanded',
      'false'
    );
  });

  it('uses controlled openIds and calls onChange instead of updating internal state', () => {
    const onChange = vi.fn();

    renderAccordion({
      openIds: ['one'],
      onChange,
    });

    const firstButton = screen.getByRole('button', { name: 'First section' });
    const secondButton = screen.getByRole('button', { name: 'Second section' });

    expect(firstButton).toHaveAttribute('aria-expanded', 'true');
    expect(secondButton).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(secondButton);

    expect(onChange).toHaveBeenCalledWith(['two']);

    expect(firstButton).toHaveAttribute('aria-expanded', 'true');
    expect(secondButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('calls onChange with multiple ids in controlled allowMultiple mode', () => {
    const onChange = vi.fn();

    renderAccordion({
      allowMultiple: true,
      openIds: ['one'],
      onChange,
    });

    fireEvent.click(screen.getByRole('button', { name: 'Second section' }));

    expect(onChange).toHaveBeenCalledWith(['one', 'two']);
  });

  it('calls onChange with an empty array when closing the only open item in controlled mode', () => {
    const onChange = vi.fn();

    renderAccordion({
      openIds: ['one'],
      onChange,
    });

    fireEvent.click(screen.getByRole('button', { name: 'First section' }));

    expect(onChange).toHaveBeenCalledWith([]);
  });

  it('passes className to the accordion root', () => {
    const { container } = renderAccordion({ className: 'custom-root' });

    const root = container.querySelector('.root');
    expect(root).toHaveClass('custom-root');
  });

  it('passes className to AccordionItem', () => {
    const { container } = render(
      <Accordion>
        <AccordionItem
          id="one"
          title="First section"
          className="custom-item"
        >
          <p>First content</p>
        </AccordionItem>
      </Accordion>
    );

    const item = container.querySelector('.item');
    expect(item).toHaveClass('custom-item');
  });

  it('passes triggerClassName to the trigger button', () => {
    const { container } = render(
      <Accordion>
        <AccordionItem
          id="one"
          title="First section"
          triggerClassName="custom-header"
        >
          <p>First content</p>
        </AccordionItem>
      </Accordion>
    );

    const button = screen.getByRole('button', { name: 'First section' });
    expect(button).toHaveClass('custom-header');
    expect(container.querySelector('.itemTitleButton')).toBeInTheDocument();
  });

  it('passes panelClassName to the panel section', () => {
    render(
      <Accordion>
        <AccordionItem
          id="one"
          title="First section"
          panelClassName="custom-panel"
        >
          <p>First content</p>
        </AccordionItem>
      </Accordion>
    );

    const panel = screen.getByText('First content').closest('section');
    expect(panel).toHaveClass('custom-panel');
  });

  it('disables an item when disabled is set', () => {
    render(
      <Accordion>
        <AccordionItem
          id="one"
          title="First section"
          disabled
        >
          <p>First content</p>
        </AccordionItem>
      </Accordion>
    );

    const button = screen.getByRole('button', { name: 'First section' });
    const item = button.closest('.item');

    expect(button).toBeDisabled();
    expect(item).toHaveAttribute('data-disabled', 'true');
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('renders open and closed icons correctly', () => {
    const { unmount } = render(
      <Accordion defaultOpenIds={['one']}>
        <AccordionItem id="one" title="First section">
          <p>First content</p>
        </AccordionItem>
      </Accordion>
    );

    expect(screen.getByTestId('icon')).toHaveAttribute('data-icon-id', 'caret-down');
    expect(screen.getByTestId('icon')).toHaveAttribute('data-size', '0.5em');

    unmount();

    render(
      <Accordion>
        <AccordionItem id="one" title="First section">
          <p>First content</p>
        </AccordionItem>
      </Accordion>
    );

    expect(screen.getByTestId('icon')).toHaveAttribute('data-icon-id', 'caret-right');
  });

  it('sets ids and accessibility relationships between header and panel', () => {
    render(
      <Accordion defaultOpenIds={['abc']}>
        <AccordionItem id="abc" title="Section title">
          <p>Panel content</p>
        </AccordionItem>
      </Accordion>
    );

    const button = screen.getByRole('button', { name: 'Section title' });
    const panel = screen.getByText('Panel content').closest('section');

    expect(button).toHaveAttribute('id', 'accordion-header-abc');
    expect(button).toHaveAttribute('aria-controls', 'accordion-panel-abc');

    expect(panel).toHaveAttribute('id', 'accordion-panel-abc');
    expect(panel).toHaveAttribute('aria-labelledby', 'accordion-header-abc');
  });

  it('renders panel content inside BodyText', () => {
    render(
      <Accordion defaultOpenIds={['one']}>
        <AccordionItem id="one" title="First section">
          <p>First content</p>
        </AccordionItem>
      </Accordion>
    );

    expect(screen.getByTestId('body-text')).toContainElement(screen.getByText('First content'));
  });

  it('throws when AccordionItem is used outside Accordion', () => {
    expect(() =>
      render(
        <AccordionItem id="one" title="First section">
          <p>First content</p>
        </AccordionItem>
      )
    ).toThrow('AccordionItem must be used within Accordion');
  });

  it('ignores children without string ids when computing toggle-all ids', () => {
    render(
      <Accordion allowMultiple>
        {'plain text'}
        <AccordionItem id="one" title="First section">
          <p>First content</p>
        </AccordionItem>
        <AccordionItem id="two" title="Second section">
          <p>Second content</p>
        </AccordionItem>
      </Accordion>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Expand all' }));

    expect(screen.getByRole('button', { name: 'First section' })).toHaveAttribute(
      'aria-expanded',
      'true'
    );
    expect(screen.getByRole('button', { name: 'Second section' })).toHaveAttribute(
      'aria-expanded',
      'true'
    );
  });
});
