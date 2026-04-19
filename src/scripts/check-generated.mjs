import { execFileSync } from 'node:child_process';

const generatedFiles = [
  'src/assets/icons/icons.svg',
  'src/components/Layout/Section/Section.module.css',
  'src/design-tokens/icons.ts',
  'src/design-tokens/spacing.ts',
  'src/styles/breakpoints.css',
  'src/styles/breakpoints.ts',
  'src/styles/variables.css',
  'src/styles/variables.json',
];

function getGitStatus(paths) {
  return execFileSync('git', ['status', '--short', '--', ...paths], {
    encoding: 'utf8',
  }).trim();
}

try {
  const output = getGitStatus(generatedFiles);

  if (output) {
    console.error('Generated files are out of date or contain uncommitted changes:\n');
    console.error(output);
    process.exitCode = 1;
  } else {
    console.log('Generated files are in sync.');
  }
} catch (error) {
  console.error('Unable to verify generated files with git status.');
  throw error;
}
