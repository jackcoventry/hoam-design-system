import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { Accordion, AccordionHeader, AccordionItem, AccordionPanel } from './Accordion';

function renderBasicAccordion(props?: Partial<React.ComponentProps<typeof Accordion>>) {
  return render(
    <Accordion {...props}>
      <AccordionItem id="one">
        <AccordionHeader>Section 1</AccordionHeader>
        <AccordionPanel>Content 1</AccordionPanel>
      </AccordionItem>
      <AccordionItem id="two">
        <AccordionHeader>Section 2</AccordionHeader>
        <AccordionPanel>Content 2</AccordionPanel>
      </AccordionItem>
      <AccordionItem id="three">
        <AccordionHeader>Section 3</AccordionHeader>
        <AccordionPanel>Content 3</AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}

describe('Accordion', () => {
  it('renders all accordion headers', () => {
    renderBasicAccordion();

    expect(screen.getByRole('button', { name: /section 1/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /section 2/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /section 3/i })).toBeInTheDocument();
  });

  it('starts closed by default in uncontrolled mode', () => {
    renderBasicAccordion();

    expect(screen.getByText('Content 1').closest('section')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByText('Content 2').closest('section')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByText('Content 3').closest('section')).toHaveAttribute('aria-hidden', 'true');
  });

  it('opens defaultOpenIds on initial render', () => {
    renderBasicAccordion({ defaultOpenIds: ['one', 'three'], allowMultiple: true });

    expect(screen.getByText('Content 1').closest('section')).toHaveAttribute(
      'aria-hidden',
      'false'
    );
    expect(screen.getByText('Content 2').closest('section')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByText('Content 3').closest('section')).toHaveAttribute(
      'aria-hidden',
      'false'
    );
  });

  it('opens and closes an item in uncontrolled single-open mode', async () => {
    const user = userEvent.setup();
    renderBasicAccordion();

    const section1Trigger = screen.getByRole('button', { name: /section 1/i });

    await user.click(section1Trigger);
    expect(section1Trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Content 1').closest('section')).toHaveAttribute(
      'aria-hidden',
      'false'
    );

    await user.click(section1Trigger);
    expect(section1Trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByText('Content 1').closest('section')).toHaveAttribute('aria-hidden', 'true');
  });

  it('only keeps one item open when allowMultiple is false', async () => {
    const user = userEvent.setup();
    renderBasicAccordion({ allowMultiple: false });

    const section1Trigger = screen.getByRole('button', { name: /section 1/i });
    const section2Trigger = screen.getByRole('button', { name: /section 2/i });

    await user.click(section1Trigger);
    expect(section1Trigger).toHaveAttribute('aria-expanded', 'true');
    expect(section2Trigger).toHaveAttribute('aria-expanded', 'false');

    await user.click(section2Trigger);
    expect(section1Trigger).toHaveAttribute('aria-expanded', 'false');
    expect(section2Trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('allows multiple items to be open when allowMultiple is true', async () => {
    const user = userEvent.setup();
    renderBasicAccordion({ allowMultiple: true });

    const section1Trigger = screen.getByRole('button', { name: /section 1/i });
    const section2Trigger = screen.getByRole('button', { name: /section 2/i });

    await user.click(section1Trigger);
    await user.click(section2Trigger);

    expect(section1Trigger).toHaveAttribute('aria-expanded', 'true');
    expect(section2Trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Content 1').closest('section')).toHaveAttribute(
      'aria-hidden',
      'false'
    );
    expect(screen.getByText('Content 2').closest('section')).toHaveAttribute(
      'aria-hidden',
      'false'
    );
  });

  it('renders expand all button only when allowMultiple is true and there is more than one item', () => {
    renderBasicAccordion({ allowMultiple: true });

    expect(
      screen.getByRole('button', { name: /expand all accordion sections/i })
    ).toBeInTheDocument();
  });

  it('does not render expand all button when allowMultiple is false', () => {
    renderBasicAccordion({ allowMultiple: false });

    expect(
      screen.queryByRole('button', { name: /expand all accordion sections/i })
    ).not.toBeInTheDocument();
  });

  it('expands all items when clicking expand all', async () => {
    const user = userEvent.setup();
    renderBasicAccordion({ allowMultiple: true });

    const toggleAllButton = screen.getByRole('button', {
      name: /expand all accordion sections/i,
    });

    await user.click(toggleAllButton);

    expect(screen.getByRole('button', { name: /section 1/i })).toHaveAttribute(
      'aria-expanded',
      'true'
    );
    expect(screen.getByRole('button', { name: /section 2/i })).toHaveAttribute(
      'aria-expanded',
      'true'
    );
    expect(screen.getByRole('button', { name: /section 3/i })).toHaveAttribute(
      'aria-expanded',
      'true'
    );

    expect(screen.getByText('Content 1').closest('section')).toHaveAttribute(
      'aria-hidden',
      'false'
    );
    expect(screen.getByText('Content 2').closest('section')).toHaveAttribute(
      'aria-hidden',
      'false'
    );
    expect(screen.getByText('Content 3').closest('section')).toHaveAttribute(
      'aria-hidden',
      'false'
    );
  });

  it('collapses all items when clicking collapse all after expanding them', async () => {
    const user = userEvent.setup();
    renderBasicAccordion({ allowMultiple: true });

    const expandAllButton = screen.getByRole('button', {
      name: /expand all accordion sections/i,
    });

    await user.click(expandAllButton);

    const collapseAllButton = screen.getByRole('button', {
      name: /collapse all accordion sections/i,
    });

    await user.click(collapseAllButton);

    expect(screen.getByRole('button', { name: /section 1/i })).toHaveAttribute(
      'aria-expanded',
      'false'
    );
    expect(screen.getByRole('button', { name: /section 2/i })).toHaveAttribute(
      'aria-expanded',
      'false'
    );
    expect(screen.getByRole('button', { name: /section 3/i })).toHaveAttribute(
      'aria-expanded',
      'false'
    );
  });

  it('supports controlled mode', async () => {
    const user = userEvent.setup();

    function ControlledExample() {
      const [openIds, setOpenIds] = useState<string[]>(['two']);

      return (
        <Accordion
          openIds={openIds}
          onChange={setOpenIds}
        >
          <AccordionItem id="one">
            <AccordionHeader>Section 1</AccordionHeader>
            <AccordionPanel>Content 1</AccordionPanel>
          </AccordionItem>
          <AccordionItem id="two">
            <AccordionHeader>Section 2</AccordionHeader>
            <AccordionPanel>Content 2</AccordionPanel>
          </AccordionItem>
        </Accordion>
      );
    }

    render(<ControlledExample />);

    const section1Trigger = screen.getByRole('button', { name: /section 1/i });
    const section2Trigger = screen.getByRole('button', { name: /section 2/i });

    expect(section1Trigger).toHaveAttribute('aria-expanded', 'false');
    expect(section2Trigger).toHaveAttribute('aria-expanded', 'true');

    await user.click(section1Trigger);

    expect(section1Trigger).toHaveAttribute('aria-expanded', 'true');
    expect(section2Trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('calls onChange in controlled mode', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <Accordion
        openIds={[]}
        onChange={onChange}
        allowMultiple
      >
        <AccordionItem id="one">
          <AccordionHeader>Section 1</AccordionHeader>
          <AccordionPanel>Content 1</AccordionPanel>
        </AccordionItem>
        <AccordionItem id="two">
          <AccordionHeader>Section 2</AccordionHeader>
          <AccordionPanel>Content 2</AccordionPanel>
        </AccordionItem>
      </Accordion>
    );

    await user.click(screen.getByRole('button', { name: /section 1/i }));
    expect(onChange).toHaveBeenCalledWith(['one']);
  });

  it('does not toggle a disabled accordion item', async () => {
    const user = userEvent.setup();

    render(
      <Accordion>
        <AccordionItem id="one">
          <AccordionHeader disabled>Section 1</AccordionHeader>
          <AccordionPanel>Content 1</AccordionPanel>
        </AccordionItem>
        <AccordionItem id="two">
          <AccordionHeader>Section 2</AccordionHeader>
          <AccordionPanel>Content 2</AccordionPanel>
        </AccordionItem>
      </Accordion>
    );

    const disabledTrigger = screen.getByRole('button', { name: /section 1/i });

    expect(disabledTrigger).toBeDisabled();

    await user.click(disabledTrigger);

    expect(disabledTrigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByText('Content 1').closest('section')).toHaveAttribute('aria-hidden', 'true');
  });

  it('associates trigger and panel with aria-controls and aria-labelledby', async () => {
    const user = userEvent.setup();
    renderBasicAccordion();

    const trigger = screen.getByRole('button', { name: /section 1/i });
    const panel = screen.getByText('Content 1').closest('section');

    expect(trigger).toHaveAttribute('aria-controls');
    expect(panel).toHaveAttribute('aria-labelledby', trigger.id);

    await user.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(panel).toHaveAttribute('aria-hidden', 'false');
  });

  it('throws when AccordionItem is used outside Accordion', () => {
    expect(() =>
      render(
        <AccordionItem id="one">
          <AccordionHeader>Section 1</AccordionHeader>
          <AccordionPanel>Content 1</AccordionPanel>
        </AccordionItem>
      )
    ).toThrow('AccordionItem must be used within Accordion');
  });

  it('throws when AccordionItem does not receive exactly two children', () => {
    expect(() =>
      render(
        <Accordion>
          <AccordionItem id="one">
            <AccordionHeader>Section 1</AccordionHeader>
          </AccordionItem>
        </Accordion>
      )
    ).toThrow(
      'AccordionItem must contain exactly two children: <AccordionHeader /> and <AccordionPanel />'
    );
  });

  it('throws when AccordionItem children are in the wrong order', () => {
    expect(() =>
      render(
        <Accordion>
          <AccordionItem id="one">
            <AccordionPanel>Content 1</AccordionPanel>
            <AccordionHeader>Section 1</AccordionHeader>
          </AccordionItem>
        </Accordion>
      )
    ).toThrow('The first child of AccordionItem must be <AccordionHeader />');
  });
});
