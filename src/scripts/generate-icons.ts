import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const iconsDir = path.join(__dirname, '../icons');
const iconsTsOutput = path.join(__dirname, '../design-tokens/icons.ts');

async function generateIcons(): Promise<void> {
  const files = await fs.readdir(iconsDir);

  const icons = files
    .filter((file) => file.endsWith('.svg'))
    .map((file) => path.basename(file, '.svg'))
    .sort((a, b) => a.localeCompare(b));

  if (icons.length === 0) {
    throw new Error('No icons found in icons directory');
  }

  const uniqueIcons = new Set(icons);
  if (uniqueIcons.size !== icons.length) {
    throw new Error('Duplicate icon names detected');
  }

  const tsContent = `// AUTO-GENERATED FILE — DO NOT EDIT

export const ICON_IDS = ${JSON.stringify(icons, null, 2)} as const;

export type IconId = (typeof ICON_IDS)[number];
`;

  await fs.writeFile(iconsTsOutput, tsContent, 'utf8');

  console.log(`Generated ${icons.length} icons → ${iconsTsOutput}`);
}

await generateIcons();
