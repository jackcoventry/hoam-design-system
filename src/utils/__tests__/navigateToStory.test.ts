import { vi } from 'vitest';

import { navigateToStory } from '@/utils/navigateToStory';

const mockEmit = vi.fn();
const mockGetChannel = vi.fn(() => ({ emit: mockEmit }));
const mockToId = vi.fn<(kind: string, story: string) => string>();

vi.mock('storybook/preview-api', () => ({
  addons: {
    getChannel: () => mockGetChannel(),
  },
}));

vi.mock('storybook/internal/csf', () => ({
  toId: (kind: string, story: string) => mockToId(kind, story),
}));

vi.mock('storybook/internal/core-events', () => ({
  SELECT_STORY: 'select-story',
}));

describe('navigateToStory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('emits the SELECT_STORY event with the correct payload', () => {
    mockToId.mockReturnValue('my-story-id');

    navigateToStory('Button', 'Primary');

    expect(mockGetChannel).toHaveBeenCalledTimes(1);

    expect(mockToId).toHaveBeenCalledWith('Button', 'Primary');

    expect(mockEmit).toHaveBeenCalledWith('select-story', {
      storyId: 'my-story-id',
      viewMode: 'story',
    });
  });

  it('passes through the generated storyId from toId', () => {
    mockToId.mockReturnValue('custom-id');

    navigateToStory('Card', 'Default');

    expect(mockEmit).toHaveBeenCalledWith('select-story', {
      storyId: 'custom-id',
      viewMode: 'story',
    });
  });
});
