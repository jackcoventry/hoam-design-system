import { SELECT_STORY } from 'storybook/internal/core-events';
import { toId } from 'storybook/internal/csf';
import { addons } from 'storybook/preview-api';

export function navigateToStory(kind: string, story: string) {
  const channel = addons.getChannel();

  channel.emit(SELECT_STORY, {
    storyId: toId(kind, story),
    viewMode: 'story',
  });
}
