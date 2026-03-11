import { render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { InfoGrid, InfoGridItem } from '@/components/InfoGrid';
import { assertHTMLElement } from '@/utils/test-utils';

function makeItem(i: number, icon = 'coffee') {
  return (
    <InfoGridItem
      key={i}
      title={`Item ${i}`}
      description={`Description ${i}`}
      icon={icon}
    />
  );
}

describe('InfoGrid', () => {
  let errorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the title and description', () => {
    render(
      <InfoGrid
        title="Grid Title"
        description="Grid description"
      >
        {makeItem(1)}
      </InfoGrid>
    );

    expect(screen.getByRole('heading', { level: 2, name: 'Grid Title' })).toBeInTheDocument();
    expect(screen.getByText('Grid description')).toBeInTheDocument();
  });

  it('omits the description when not provided', () => {
    render(<InfoGrid title="Only Title">{makeItem(1)}</InfoGrid>);

    expect(screen.getByRole('heading', { level: 2, name: 'Only Title' })).toBeInTheDocument();
    // There should be no paragraph containing "Grid description"
    expect(screen.queryByText(/Grid description/i)).not.toBeInTheDocument();
  });

  it('renders up to three InfoGridItem children', () => {
    render(
      <InfoGrid title="Grid Title">
        {makeItem(1)}
        {makeItem(2)}
        {makeItem(3)}
      </InfoGrid>
    );

    // The three item titles should be present
    expect(screen.getByRole('heading', { level: 3, name: 'Item 1' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Item 2' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Item 3' })).toBeInTheDocument();

    // Each item also has it's description
    expect(screen.getByText('Description 1')).toBeInTheDocument();
    expect(screen.getByText('Description 2')).toBeInTheDocument();
    expect(screen.getByText('Description 3')).toBeInTheDocument();

    // Also check the grid wrappers for items by their common grid class
    const columns = document.querySelectorAll(String.raw`.span-12.lg\:span-4`);
    expect(columns.length).toBe(3);
  });

  it('does not render more than three items and logs an error for the 4th', () => {
    render(
      <InfoGrid title="Grid Title">
        {makeItem(1)}
        {makeItem(2)}
        {makeItem(3)}
        {makeItem(4)} {/* this should be ignored */}
      </InfoGrid>
    );

    // There should only be three items present
    expect(screen.queryByRole('heading', { level: 3, name: 'Item 4' })).not.toBeInTheDocument();

    expect(errorSpy).toHaveBeenCalledTimes(1);
  });

  it('logs an error and ignores non-InfoGridItem children', () => {
    render(
      <InfoGrid title="Grid Title">
        {makeItem(1)}
        <div>Not allowed</div>
      </InfoGrid>
    );

    expect(screen.getByRole('heading', { level: 3, name: 'Item 1' })).toBeInTheDocument();

    // The div shouldn't be there
    expect(screen.queryByText('Not allowed')).not.toBeInTheDocument();

    // Errors logged
    expect(errorSpy).toHaveBeenCalledTimes(1);
    expect(errorSpy).toHaveBeenCalledWith(
      'InfoGrid component only accepts child of type InfoGridItem'
    );
  });

  it('wires the SVG <use> xlinkHref to the provided icon id', () => {
    render(<InfoGrid title="Grid Title">{makeItem(1, 'coffee')}</InfoGrid>);

    const item = screen
      .getByRole('heading', { level: 3, name: 'Item 1' })
      .closest('.hoam-info-grid-item');
    expect(item).not.toBeNull();

    const svgUse = item?.querySelector('use');
    expect(svgUse).not.toBeNull();

    const xlinkHref = svgUse?.getAttribute('xlink:href') ?? svgUse?.getAttribute('href');
    expect(xlinkHref).toBe('/icons/icons.svg#coffee');
  });

  it('renders InfoGridItem structure correctly (icon span, title, description)', () => {
    render(<InfoGrid title="Grid Title">{makeItem(1, 'bean')}</InfoGrid>);

    const heading = screen.getByRole('heading', { level: 3, name: 'Item 1' });
    const item = heading.closest('.hoam-info-grid-item');

    assertHTMLElement(item);

    const utils = within(item);
    expect(utils.getByRole('heading', { level: 3, name: 'Item 1' })).toBeInTheDocument();
    expect(utils.getByText('Description 1')).toBeInTheDocument();

    // Probably overkill, but this will check the icon wrapper is present
    expect(item.querySelector('.hoam-info-grid-item__icon')).not.toBeNull();
  });
});
