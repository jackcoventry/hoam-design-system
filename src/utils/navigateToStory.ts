import { addons } from 'storybook/preview-api';
import { SELECT_STORY } from 'storybook/internal/core-events';
import { toId } from 'storybook/internal/csf';

export function navigateToStory(kind: string, story: string) {
  const channel = addons.getChannel();

  channel.emit(SELECT_STORY, {
    storyId: toId(kind, story),
    viewMode: 'story',
  });
}