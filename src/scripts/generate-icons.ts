import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const iconsDir = path.join(__dirname, '../icons');
const iconsOutput = path.join(__dirname, '../design-tokens/icons.json');

type IconsFile = {
  icons: string[];
};

async function generateIcons(): Promise<void> {
  const files = await fs.readdir(iconsDir);

  const icons = files
    .filter((file) => file.endsWith('.svg'))
    .map((file) => path.basename(file, '.svg'));

  const json: IconsFile = { icons };

  await fs.writeFile(iconsOutput, JSON.stringify(json, null, 2), 'utf8');

  console.log(`Generated ${icons.length} icons → ${iconsOutput}`);
}

await generateIcons();
