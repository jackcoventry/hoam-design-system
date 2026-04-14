import Tokens from '@/styles/variables.json';
import type { Token, TypographyToken } from '@/design-tokens/types';
import { TypographyDocs } from '@/stories/components/TypographyBlock/TypographyBlock';

const Template = () => {
  const typographyTokens: TypographyToken[] = (Tokens as Token[]).filter(
    (token): token is TypographyToken => token.type === 'typography'
  );

  return <TypographyDocs tokens={typographyTokens} />;
};

export default {
  title: 'Foundations/Typography',
  component: Template,
  argTypes: {},
};

export const Example = {
  args: {},
};
