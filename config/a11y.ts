import axeCore, { type AxeResults, type RunOptions } from 'axe-core';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const axeSourcePath = require.resolve('axe-core/axe.min.js');

const defaultRules: NonNullable<RunOptions['rules']> = {
  // JSDOM cannot reliably compute color contrast.
  'color-contrast': { enabled: false },
};

function mergeRunOptions(options: RunOptions = {}): RunOptions {
  return {
    ...options,
    rules: {
      ...defaultRules,
      ...options.rules,
    },
  };
}

export async function runAxe(
  container: Parameters<typeof axeCore.run>[0],
  options: RunOptions = {}
) {
  return axeCore.run(container, mergeRunOptions(options));
}

export function getAxeSource() {
  return readFileSync(axeSourcePath, 'utf8');
}

export function formatAxeViolations(results: Pick<AxeResults, 'violations'>) {
  return results.violations
    .map((violation) => {
      const nodes = violation.nodes
        .map(
          (node) => `  - ${node.target.join(', ')}: ${node.failureSummary ?? 'Violation found.'}`
        )
        .join('\n');

      return `${violation.id} (${violation.impact ?? 'unknown'}): ${violation.description}\n${nodes}`;
    })
    .join('\n\n');
}

export function assertNoAxeViolations(results: Pick<AxeResults, 'violations'>) {
  if (results.violations.length > 0) {
    throw new Error(`Accessibility violations found:\n\n${formatAxeViolations(results)}`);
  }
}
