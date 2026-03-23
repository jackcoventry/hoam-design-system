import { useState } from 'react';

import { Button } from '@/components/Button/Button';
import { Icon } from '@/components/Icon';
import { Container, Grid, GridItem } from '@/components/Layout';
import { ICON_IDS } from '@/design-tokens/icons';

type Props = {
  icon: string;
};

const CopyButton = ({ icon }: Props) => {
  const [copied, setCopied] = useState(false);

  const copyCodeBlock = () => {
    navigator.clipboard.writeText(`<Icon id="${icon}" />`).then(
      () => {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 3000);
      },
      () => {
        setCopied(false);
      }
    );
  };

  return (
    <Button
      type="button"
      onClick={copyCodeBlock}
      variant={copied ? 'tertiary' : 'primary'}
    >
      {copied ? 'Copied!' : 'Copy'}
    </Button>
  );
};

const Template = () => (
  <Container>
    <Grid>
      <GridItem span={12}>
        <h1>Icons</h1>
      </GridItem>
      <GridItem>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Example</th>
              <th>Usage</th>
            </tr>
          </thead>
          <tbody>
            {ICON_IDS?.map((e) => (
              <tr key={e}>
                <td>{e}</td>
                <td>
                  <Icon id={e} />
                </td>
                <td>
                  <CopyButton icon={e} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GridItem>
    </Grid>
  </Container>
);

export default {
  title: 'Foundations/Icons',
  component: Template,
  argTypes: {},
};

export const Example = {
  args: {},
};
