import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filesToDelete = [
  path.resolve(__dirname, '../../design-tokens/_variables.css'),
  path.resolve(__dirname, '../../design-tokens/variables.json'),
] as const;

async function deleteFile(file: string): Promise<void> {
  try {
    await fs.unlink(file);
    console.log(`Successfully deleted: ${file}`);
  } catch (error: unknown) {
    if (isErrnoException(error) && error.code === 'ENOENT') {
      console.log(`File already missing: ${file}`);
      return;
    }

    if (error instanceof Error) {
      console.error(`Error deleting file ${file}: ${error.message}`);
      return;
    }

    console.error(`Error deleting file ${file}:`, error);
  }
}

function isErrnoException(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error;
}

await Promise.all(filesToDelete.map(deleteFile));

console.log('All files processed.');
