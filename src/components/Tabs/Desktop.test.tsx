import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { DesktopTabs } from '@/components/Tabs/Desktop';

const items = [
  {
    id: 'one',
    label: 'Tab One',
    content: <div>Panel One</div>,
  },
  {
    id: 'two',
    label: 'Tab Two',
    content: <div>Panel Two</div>,
  },
  {
    id: 'three',
    label: 'Tab Three',
    content: <div>Panel Three</div>,
  },
];

describe('DesktopTabs', () => {
  it('renders null when there are no items', () => {
    const { container } = render(
      <DesktopTabs
        title="Empty tabs"
        items={[]}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('selects the first tab by default', () => {
    render(
      <DesktopTabs
        title="Example tabs"
        items={items}
      />
    );

    const firstTab = screen.getByRole('tab', { name: /tab one/i });
    const secondTab = screen.getByRole('tab', { name: /tab two/i });

    expect(firstTab).toHaveAttribute('aria-selected', 'true');
    expect(firstTab).toHaveAttribute('tabindex', '0');

    expect(secondTab).toHaveAttribute('aria-selected', 'false');
    expect(secondTab).toHaveAttribute('tabindex', '-1');

    expect(screen.getByText('Panel One').closest('[role="tabpanel"]')).not.toHaveAttribute(
      'hidden'
    );
    expect(screen.getByText('Panel Two').closest('[role="tabpanel"]')).toHaveAttribute('hidden');
  });

  it('activates a tab when clicked', async () => {
    const user = userEvent.setup();

    render(
      <DesktopTabs
        title="Example tabs"
        items={items}
      />
    );

    const secondTab = screen.getByRole('tab', { name: /tab two/i });

    await user.click(secondTab);

    expect(secondTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Panel Two').closest('[role="tabpanel"]')).not.toHaveAttribute(
      'hidden'
    );
    expect(screen.getByText('Panel One').closest('[role="tabpanel"]')).toHaveAttribute('hidden');
  });

  it('moves focus with ArrowDown in vertical mode', async () => {
    const user = userEvent.setup();

    render(
      <DesktopTabs
        title="Example tabs"
        items={items}
        layout="vertical"
      />
    );

    const firstTab = screen.getByRole('tab', { name: /tab one/i });
    const secondTab = screen.getByRole('tab', { name: /tab two/i });

    firstTab.focus();
    expect(firstTab).toHaveFocus();

    await user.keyboard('{ArrowDown}');
    expect(secondTab).toHaveFocus();
  });

  it('moves focus with ArrowRight in horizontal mode', async () => {
    const user = userEvent.setup();

    render(
      <DesktopTabs
        title="Example tabs"
        items={items}
        layout="horizontal"
      />
    );

    const firstTab = screen.getByRole('tab', { name: /tab one/i });
    const secondTab = screen.getByRole('tab', { name: /tab two/i });

    firstTab.focus();
    expect(firstTab).toHaveFocus();

    await user.keyboard('{ArrowRight}');
    expect(secondTab).toHaveFocus();
  });

  it('does not activate focused tab on arrow navigation in manual mode', async () => {
    const user = userEvent.setup();

    render(
      <DesktopTabs
        title="Example tabs"
        items={items}
        mode="manual"
      />
    );

    const firstTab = screen.getByRole('tab', { name: /tab one/i });
    const secondTab = screen.getByRole('tab', { name: /tab two/i });

    firstTab.focus();
    await user.keyboard('{ArrowDown}');

    expect(secondTab).toHaveFocus();
    expect(firstTab).toHaveAttribute('aria-selected', 'true');
    expect(secondTab).toHaveAttribute('aria-selected', 'false');
  });

  it('activates focused tab on arrow navigation in automatic mode', async () => {
    const user = userEvent.setup();

    render(
      <DesktopTabs
        title="Example tabs"
        items={items}
        mode="automatic"
      />
    );

    const firstTab = screen.getByRole('tab', { name: /tab one/i });
    const secondTab = screen.getByRole('tab', { name: /tab two/i });

    firstTab.focus();
    await user.keyboard('{ArrowDown}');

    expect(secondTab).toHaveFocus();
    expect(secondTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Panel Two').closest('[role="tabpanel"]')).not.toHaveAttribute(
      'hidden'
    );
  });

  it('activates a focused tab with Enter in manual mode', async () => {
    const user = userEvent.setup();

    render(
      <DesktopTabs
        title="Example tabs"
        items={items}
        mode="manual"
      />
    );

    const firstTab = screen.getByRole('tab', { name: /tab one/i });
    const secondTab = screen.getByRole('tab', { name: /tab two/i });

    firstTab.focus();
    await user.keyboard('{ArrowDown}');
    expect(secondTab).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(secondTab).toHaveAttribute('aria-selected', 'true');
  });

  it('activates a focused tab with Space in manual mode', async () => {
    const user = userEvent.setup();

    render(
      <DesktopTabs
        title="Example tabs"
        items={items}
        mode="manual"
      />
    );

    const firstTab = screen.getByRole('tab', { name: /tab one/i });
    const secondTab = screen.getByRole('tab', { name: /tab two/i });

    firstTab.focus();
    await user.keyboard('{ArrowDown}');
    await user.keyboard(' ');

    expect(secondTab).toHaveAttribute('aria-selected', 'true');
  });

  it('moves focus to first tab on Home', async () => {
    const user = userEvent.setup();

    render(
      <DesktopTabs
        title="Example tabs"
        items={items}
      />
    );

    const firstTab = screen.getByRole('tab', { name: /tab one/i });
    const thirdTab = screen.getByRole('tab', { name: /tab three/i });

    thirdTab.focus();
    expect(thirdTab).toHaveFocus();

    await user.keyboard('{Home}');
    expect(firstTab).toHaveFocus();
  });

  it('moves focus to last tab on End', async () => {
    const user = userEvent.setup();

    render(
      <DesktopTabs
        title="Example tabs"
        items={items}
      />
    );

    const firstTab = screen.getByRole('tab', { name: /tab one/i });
    const thirdTab = screen.getByRole('tab', { name: /tab three/i });

    firstTab.focus();
    expect(firstTab).toHaveFocus();

    await user.keyboard('{End}');
    expect(thirdTab).toHaveFocus();
  });

  it('wires tabs and panels together correctly', () => {
    render(
      <DesktopTabs
        title="Example tabs"
        items={items}
      />
    );

    const firstTab = screen.getByRole('tab', { name: /tab one/i });
    const firstPanel = screen.getByText('Panel One').closest('[role="tabpanel"]');

    expect(firstTab).toHaveAttribute('id', 'hoam-tab-one');
    expect(firstTab).toHaveAttribute('aria-controls', 'hoam-panel-one');
    expect(firstPanel).toHaveAttribute('id', 'hoam-panel-one');
    expect(firstPanel).toHaveAttribute('aria-labelledby', 'hoam-tab-one');
  });
});
