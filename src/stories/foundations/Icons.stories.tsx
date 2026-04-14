import { useState } from 'react';

import { Button } from '@/components/Button/Button';
import { BodyText } from '@/components/Common/BodyText';
import { Icon } from '@/components/Icon';
import { Container, Grid, GridItem } from '@/components/Layout';
import { Table, TableBody, TableHeader } from '@/components/Table';
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
      size="small"
    >
      {copied ? '✔️' : 'Copy'}
    </Button>
  );
};

const Template = () => (
  <Container width="full">
    <Grid>
      <GridItem span={12}>
        <BodyText>
          <h1>Icons</h1>
        </BodyText>
      </GridItem>
      <GridItem>
        <Table>
          <TableHeader>
            <tr>
              <th>Name</th>
              <th>Example</th>
              <th>Usage</th>
            </tr>
          </TableHeader>
          <TableBody>
            {ICON_IDS?.map((e) => (
              <tr key={e}>
                <td>{e}</td>
                <td>
                  <span
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon
                      id={e}
                      size="2em"
                    />
                  </span>
                </td>
                <td>
                  <span
                    style={{
                      display: 'flex',
                      justifyContent: 'end',
                    }}
                  >
                    <CopyButton icon={e} />
                  </span>
                </td>
              </tr>
            ))}
          </TableBody>
        </Table>
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
