import type { Meta, StoryObj } from '@storybook/react-vite';

import { BodyText } from '@/components/Common/BodyText';
import { Container, Grid, GridItem } from '@/components/Layout';
import rawTokens from '@/styles/variables.json';
import { Palette } from '@/stories/components/Palette/Palette';

type RawToken = {
  name: string;
  cssVar?: string;
  type: string | null;
  value: string | number;
  group: string | null;
  set: string;
  originalValues?: Record<string, string | number>;
};

type ColorToken = {
  name: string;
  value: string;
  cssVar?: string;
  group: string;
  set: string;
};

export type ColorSet = {
  name: string;
  items: ColorToken[];
};

type ColorGroup = {
  name: string;
  sets: ColorSet[];
};

function isColorToken(token: RawToken): token is RawToken & { type: 'color'; value: string } {
  return token.type === 'color' && typeof token.value === 'string';
}

function groupColorTokens(tokens: RawToken[]): ColorGroup[] {
  const grouped = tokens
    .filter(isColorToken)
    .reduce<Record<string, Record<string, ColorToken[]>>>((acc, token) => {
      const groupName = token.group ?? 'ungrouped';
      const setName = token.set;

      acc[groupName] ??= {};
      acc[groupName][setName] ??= [];

      acc[groupName][setName].push({
        name: token.name,
        value: token.value,
        group: groupName,
        set: setName,
        ...(token.cssVar ? { cssVar: token.cssVar } : {}),
      });

      return acc;
    }, {});

  return Object.entries(grouped)
    .map(([groupName, sets]) => ({
      name: groupName,
      sets: Object.entries(sets)
        .map(([setName, items]) => ({
          name: setName,
          items: items.slice().sort((a: ColorToken, b: ColorToken) => a.name.localeCompare(b.name)),
        }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

const colorGroups = groupColorTokens(rawTokens as RawToken[]);
const aliasTokens = colorGroups.filter((e) => e.name !== 'global');
const paletteTokens = colorGroups.filter((e) => e.name === 'global');

function ColorTokensDemo(args: Readonly<{ data: ColorGroup[] }>) {
  return (
    <Container width="full">
      <Grid>
        <GridItem span={12}>
          <BodyText>
            <h1>Color tokens</h1>
          </BodyText>
        </GridItem>
      </Grid>
      <Grid>
        <GridItem span={12}>
          <div
            style={{
              display: 'grid',
              gap: 'var(--hoam-spacing-xl)',
              padding: 'var(--hoam-spacing-md)',
            }}
          >
            {args.data.map((group: ColorGroup) => (
              <section
                key={group.name}
                style={{
                  display: 'grid',
                  gap: 'var(--hoam-spacing-lg)',
                }}
              >
                <div
                  style={{
                    display: 'grid',
                    gap: 'var(--hoam-spacing-lg)',
                  }}
                >
                  {group.sets.map((set: ColorSet) => (
                    <Palette
                      key={set.name}
                      set={set}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </GridItem>
      </Grid>
    </Container>
  );
}

const meta = {
  title: 'Foundations/Colors',
  component: ColorTokensDemo,
} satisfies Meta<typeof ColorTokensDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AliasTokens: Story = {
  render: (args) => <ColorTokensDemo data={args.data} />,
  args: {
    data: aliasTokens,
  },
};

export const PaletteTokens: Story = {
  render: (args) => <ColorTokensDemo data={args.data} />,
  args: {
    data: paletteTokens,
  },
};
