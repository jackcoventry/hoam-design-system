import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Tabs, type TabProps } from '@/components/Tabs';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';

vi.mock('@/utils/useMediaQuery', () => ({
  __esModule: true,
  default: vi.fn(),
}));

vi.mock('@/components/Accordion', () => {
  const Accordion = ({ children }: { children: React.ReactNode }) => (
    <div data-testid="accordion">{children}</div>
  );

  const AccordionItem = ({ id, children }: { id: string; children: React.ReactNode }) => (
    <div data-testid={`accordion-item-${id}`}>{children}</div>
  );

  return {
    __esModule: true,
    default: Accordion,
    AccordionItem,
  };
});

import { useMediaQuery } from '@/hooks/useMediaQuery';

const mockedUseMediaQuery = useMediaQuery as unknown as Mock;

const ITEMS: TabProps[] = [
  {
    id: 'one',
    label: 'Tab One',
    content: <div>Content One</div>,
  },
  {
    id: 'two',
    label: 'Tab Two',
    content: <div>Content Two</div>,
  },
  {
    id: 'three',
    label: 'Tab Three',
    content: <div>Content Three</div>,
  },
];

describe('<Tabs />', () => {
  beforeEach(() => {
    mockedUseMediaQuery.mockReset();
    // default to desktop unless test overrides
    mockedUseMediaQuery.mockReturnValue(false);
  });

  it('renders desktop tabs with correct ARIA and selects the first tab by default', () => {
    render(
      <Tabs
        title="Example tabs"
        items={ITEMS}
        layout="horizontal"
      />
    );

    const tablist = screen.getByRole('tablist', { name: 'Example tabs' });
    expect(tablist).toBeInTheDocument();
    expect(tablist).toHaveAttribute('aria-orientation', 'horizontal');

    const tabOne = screen.getByRole('tab', { name: 'Tab One' });
    const tabTwo = screen.getByRole('tab', { name: 'Tab Two' });
    const tabThree = screen.getByRole('tab', { name: 'Tab Three' });

    const panelOne = screen.getByRole('tabpanel', { name: 'Tab One' });
    const panelTwo = screen.getByRole('tabpanel', { name: 'Tab Two' });
    const panelThree = screen.getByRole('tabpanel', { name: 'Tab Three' });

    // First tab is selected and tabbable
    expect(tabOne).toHaveAttribute('aria-selected', 'true');
    expect(tabOne).toHaveAttribute('tabindex', '0');

    // Others are not tabbable
    expect(tabTwo).toHaveAttribute('tabindex', '-1');
    expect(tabThree).toHaveAttribute('tabindex', '-1');

    // Only the first panel is visible
    expect(panelOne).not.toHaveAttribute('hidden');
    expect(panelTwo).toHaveAttribute('hidden');
    expect(panelThree).toHaveAttribute('hidden');
  });

  it('activates a tab on click and updates panels and aria state', async () => {
    const user = userEvent.setup();
    render(
      <Tabs
        title="Example tabs"
        items={ITEMS}
        layout="horizontal"
      />
    );

    const tabOne = screen.getByRole('tab', { name: 'Tab One' });
    const tabTwo = screen.getByRole('tab', { name: 'Tab Two' });

    const panelOne = screen.getByRole('tabpanel', { name: 'Tab One' });
    const panelTwo = screen.getByRole('tabpanel', { name: 'Tab Two' });

    await user.click(tabTwo);

    expect(tabTwo).toHaveAttribute('aria-selected', 'true');
    expect(tabTwo).toHaveAttribute('tabindex', '0');
    expect(tabOne).toHaveAttribute('tabindex', '-1');

    expect(panelTwo).not.toHaveAttribute('hidden');
    expect(panelOne).toHaveAttribute('hidden');
  });

  it('supports horizontal manual mode: arrows move focus, Enter/Space activate the tab', async () => {
    const user = userEvent.setup();
    render(
      <Tabs
        title="Horizontal tabs"
        items={ITEMS}
        layout="horizontal"
        mode="manual"
      />
    );

    const tabOne = screen.getByRole('tab', { name: 'Tab One' });
    const tabTwo = screen.getByRole('tab', { name: 'Tab Two' });
    const panelOne = screen.getByRole('tabpanel', { name: 'Tab One' });
    const panelTwo = screen.getByRole('tabpanel', { name: 'Tab Two' });

    // Focus first tab
    tabOne.focus();
    expect(tabOne).toHaveFocus();

    // ArrowRight: focus moves, but in manual mode content doesn't change yet
    await user.keyboard('{ArrowRight}');
    expect(tabTwo).toHaveFocus();
    expect(tabOne).toHaveAttribute('aria-selected', 'true');
    expect(panelOne).not.toHaveAttribute('hidden');
    expect(panelTwo).toHaveAttribute('hidden');

    // Space: activates focused tab
    await user.keyboard(' ');
    expect(tabTwo).toHaveAttribute('aria-selected', 'true');
    expect(panelTwo).not.toHaveAttribute('hidden');
    expect(panelOne).toHaveAttribute('hidden');
  });

  it('supports vertical automatic mode: arrow keys move focus and activate tabs', async () => {
    const user = userEvent.setup();
    render(
      <Tabs
        title="Vertical tabs"
        items={ITEMS}
        layout="vertical"
        mode="automatic"
      />
    );

    const tabOne = screen.getByRole('tab', { name: 'Tab One' });
    const tabTwo = screen.getByRole('tab', { name: 'Tab Two' });
    const panelOne = screen.getByRole('tabpanel', { name: 'Tab One' });
    const panelTwo = screen.getByRole('tabpanel', { name: 'Tab Two' });

    // Focus first tab
    tabOne.focus();
    expect(tabOne).toHaveFocus();

    // ArrowDown: focus AND selection move in automatic mode
    await user.keyboard('{ArrowDown}');
    expect(tabTwo).toHaveFocus();
    expect(tabTwo).toHaveAttribute('aria-selected', 'true');
    expect(panelTwo).not.toHaveAttribute('hidden');
    expect(panelOne).toHaveAttribute('hidden');
  });

  it('supports Home and End keys to jump to first and last tabs', async () => {
    const user = userEvent.setup();
    render(
      <Tabs
        title="HomeEnd tabs"
        items={ITEMS}
        layout="horizontal"
        mode="manual"
      />
    );

    const tabOne = screen.getByRole('tab', { name: 'Tab One' });
    const tabTwo = screen.getByRole('tab', { name: 'Tab Two' });
    const tabThree = screen.getByRole('tab', { name: 'Tab Three' });

    // Focus middle tab
    tabTwo.focus();
    expect(tabTwo).toHaveFocus();

    await user.keyboard('{Home}');
    expect(tabOne).toHaveFocus();

    await user.keyboard('{End}');
    expect(tabThree).toHaveFocus();
  });

  it('sets aria-orientation based on layout', () => {
    const { rerender } = render(
      <Tabs
        title="Orientation"
        items={ITEMS}
        layout="horizontal"
      />
    );

    const tablist = screen.getByRole('tablist', { name: 'Orientation' });
    expect(tablist).toHaveAttribute('aria-orientation', 'horizontal');

    rerender(
      <Tabs
        title="Orientation"
        items={ITEMS}
        layout="vertical"
      />
    );
    expect(tablist).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('renders accordion instead of tabs on mobile', () => {
    mockedUseMediaQuery.mockReturnValue(true); // force mobile

    render(
      <Tabs
        title="Mobile tabs"
        items={ITEMS}
      />
    );

    // Our mock Accordion renders this test id
    const accordion = screen.getByTestId('accordion');
    expect(accordion).toBeInTheDocument();

    // Tabs should NOT be present in this mode
    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();

    // Accordion items exist for each tab
    ITEMS.forEach((item) => {
      expect(screen.getByTestId(`accordion-item-${item.id}`)).toBeInTheDocument();
      expect(screen.getByText(item.label)).toBeInTheDocument();
      expect(screen.getByText(`Content ${item.label.split(' ')[1]}`)).toBeInTheDocument();
    });
  });
});
