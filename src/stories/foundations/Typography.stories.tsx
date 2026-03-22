import Tokens from '@/styles/variables.json';
import type { Token, TypographyToken } from '@/design-tokens/types';

import typography from '@/components/Common/Typography.module.css';

const Template = () => {
  const typographyTokens: TypographyToken[] = (Tokens as Token[]).filter(
    (token): token is TypographyToken => token.type === 'typography'
  );

  return typographyTokens?.length > 0 ? (
    <>
      <h1 className={typography.subtitle}>Typography</h1>
      <table style={{ width: '100%' }}>
        <tbody>
          <tr>
            <th style={{ textAlign: 'left' }}>Token</th>
            <th style={{ textAlign: 'center' }}>Value</th>
            <th style={{ textAlign: 'center' }}>Family</th>
            <th style={{ textAlign: 'center' }}>Size</th>
            <th style={{ textAlign: 'center' }}>Weight</th>
            <th style={{ textAlign: 'center' }}>Line Height</th>
          </tr>
          {typographyTokens?.map((token) => {
            const title =
              typeof token.extensions?.$name === 'string' ? token.extensions.$name : token.cssVar;

            return (
              <tr key={token.name}>
                <td
                  style={{
                    textAlign: 'left',
                    font: `var(${token.cssVar})`,
                  }}
                >
                  {title}
                </td>
                <td style={{ textAlign: 'center' }}>{String(token.value)}</td>
                <td style={{ textAlign: 'center' }}>{token.originalValues?.fontFamily}</td>
                <td style={{ textAlign: 'center' }}>{token.originalValues?.fontSize}</td>
                <td style={{ textAlign: 'center' }}>{token.originalValues?.fontWeight}</td>
                <td style={{ textAlign: 'center' }}>{token.originalValues?.lineHeight}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  ) : null;
};

export default {
  title: 'Foundations/Typography',
  component: Template,
  argTypes: {},
};

export const Example = {
  args: {},
};
