import type { Meta, StoryObj } from '@storybook/react-vite';

import rawTokens from '@/styles/variables.json';

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

type ColorSet = {
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

type SwatchProps = {
  name: string;
  value: string;
  cssVar?: string;
};

function Swatch({ name, value, cssVar }: Readonly<SwatchProps>) {
  return (
    <div
      style={{
        display: 'grid',
        gap: '0.5rem',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '4.5rem',
          borderRadius: '0.5rem',
          backgroundColor: value,
          border: '1px solid #ddd',
        }}
      />
      <div style={{ display: 'grid', gap: '0.2rem' }}>
        <strong style={{ fontSize: '0.9rem' }}>{name}</strong>
        <span style={{ fontSize: '0.85rem' }}>{value}</span>
        {cssVar ? <code style={{ fontSize: '0.8rem' }}>{cssVar}</code> : null}
      </div>
    </div>
  );
}

type PaletteProps = {
  set: ColorSet;
};

function Palette({ set }: Readonly<PaletteProps>) {
  return (
    <section
      style={{
        display: 'grid',
        gap: '1rem',
      }}
    >
      <h3
        style={{
          margin: 0,
          textTransform: 'capitalize',
        }}
      >
        {set.name}
      </h3>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '1rem',
        }}
      >
        {set.items.map((token) => (
          <div
            key={token.name}
            style={{
              padding: '1rem',
              border: '1px solid #e5e5e5',
              borderRadius: '0.75rem',
              background: '#fff',
            }}
          >
            <Swatch
              name={token.name}
              value={token.value}
              {...(token.cssVar ? { cssVar: token.cssVar } : {})}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

function ColorTokensDemo() {
  return (
    <div
      style={{
        display: 'grid',
        gap: '2.5rem',
        padding: '1rem',
      }}
    >
      {colorGroups.map((group) => (
        <section
          key={group.name}
          style={{
            display: 'grid',
            gap: '1.5rem',
          }}
        >
          <h2
            style={{
              margin: 0,
              textTransform: 'capitalize',
            }}
          >
            {group.name}
          </h2>

          <div
            style={{
              display: 'grid',
              gap: '2rem',
            }}
          >
            {group.sets.map((set) => (
              <Palette
                key={set.name}
                set={set}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

const meta = {
  title: 'Foundations/Colors',
  component: ColorTokensDemo,
} satisfies Meta<typeof ColorTokensDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Example: Story = {
  render: () => <ColorTokensDemo />,
};
