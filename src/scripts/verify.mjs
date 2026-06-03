import { spawn } from 'node:child_process';

const STEPS = [
  { name: 'Generated files', command: ['npm', 'run', 'generate:check'] },
  { name: 'Build', command: ['npm', 'run', 'build'] },
  { name: 'Bundle budgets', command: ['npm', 'run', 'budgets'] },
  { name: 'Prettier', command: ['npm', 'run', 'prettier'] },
  { name: 'ESLint', command: ['npm', 'run', 'lint'] },
  { name: 'TypeScript', command: ['npm', 'run', 'typecheck'] },
  { name: 'Unit tests', command: ['npm', 'run', 'test:run:unit'] },
  { name: 'Accessibility', command: ['npm', 'run', 'test:a11y'] },
  { name: 'Visual layout', command: ['npm', 'run', 'test:visual'] },
];

const verbose = process.argv.includes('--verbose');
const totalSteps = STEPS.length;
const isInteractive = Boolean(process.stdout.isTTY) && !verbose;
const SPINNER_FRAMES = ['-', '\\', '|', '/'];
const ANSI = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function formatDuration(startTime) {
  const elapsedMs = Date.now() - startTime;
  const seconds = elapsedMs / 1000;

  if (seconds < 60) {
    return `${seconds.toFixed(1)}s`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainderSeconds = seconds % 60;
  return `${minutes}m ${remainderSeconds.toFixed(1)}s`;
}

function formatPercent(index) {
  return `${Math.round((index / totalSteps) * 100)
    .toString()
    .padStart(3, ' ')}%`;
}

function colorize(text, color) {
  return `${color}${text}${ANSI.reset}`;
}

function formatPrefix(index) {
  return `${colorize(formatPercent(index), ANSI.cyan)}  ${colorize(
    `${index}/${totalSteps}`,
    ANSI.bold
  )}`;
}

function buildProgressBar(index) {
  const width = 10;
  const filled = Math.max(0, Math.min(width, Math.round((index / totalSteps) * width)));
  return `[${colorize('='.repeat(filled), ANSI.green)}${colorize('-'.repeat(width - filled), ANSI.dim)}]`;
}

function printStepStart(index, step) {
  process.stdout.write(`${formatPrefix(index - 1)}  ${colorize(step.name, ANSI.blue)}\n`);
}

function printStepDone(index, step, startTime) {
  process.stdout.write(
    `${formatPrefix(index)}  ${buildProgressBar(index)}  ${colorize(step.name, ANSI.green)}  ${colorize('done', ANSI.green)} in ${colorize(
      formatDuration(startTime),
      ANSI.bold
    )}\n`
  );
}

function printFailure(index, step, output, startTime) {
  process.stderr.write(
    `\n${formatPrefix(index - 1)}  ${buildProgressBar(index - 1)}  ${colorize(step.name, ANSI.red)}  ${colorize('failed', ANSI.red)} after ${colorize(
      formatDuration(startTime),
      ANSI.bold
    )}\n`
  );

  const trimmed = output.trim();
  if (trimmed) {
    process.stderr.write(`\n${trimmed}\n`);
  }
}

function startSpinner(index, step, startTime) {
  if (!isInteractive) {
    return () => {};
  }

  let frameIndex = 0;

  const render = () => {
    const frame = SPINNER_FRAMES[frameIndex % SPINNER_FRAMES.length];
    process.stdout.write(
      `\r${formatPrefix(index - 1)}  ${buildProgressBar(index - 1)}  ${colorize(frame, ANSI.yellow)} ${colorize(
        step.name,
        ANSI.blue
      )} ${colorize(formatDuration(startTime), ANSI.dim)}   `
    );
    frameIndex += 1;
  };

  render();
  const timer = setInterval(render, 120);

  return () => {
    clearInterval(timer);
    process.stdout.write('\r\x1b[2K');
  };
}

function runStep(step) {
  return new Promise((resolve, reject) => {
    const child = spawn(step.command[0], step.command.slice(1), {
      cwd: process.cwd(),
      env: process.env,
      stdio: verbose ? 'inherit' : ['ignore', 'pipe', 'pipe'],
    });

    if (verbose) {
      child.on('error', reject);
      child.on('close', (code) => {
        if (code === 0) {
          resolve('');
          return;
        }

        reject(new Error(`${step.command.join(' ')} exited with code ${code ?? 'unknown'}`));
      });
      return;
    }

    let output = '';

    child.stdout.on('data', (chunk) => {
      output += chunk.toString();
    });

    child.stderr.on('data', (chunk) => {
      output += chunk.toString();
    });

    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) {
        resolve(output);
        return;
      }

      const error = new Error(`${step.command.join(' ')} exited with code ${code ?? 'unknown'}`);
      error.output = output;
      reject(error);
    });
  });
}

async function main() {
  const verifyStart = Date.now();

  if (!verbose) {
    process.stdout.write(`${colorize('Verify', ANSI.bold)}\n\n`);
  }

  for (const [offset, step] of STEPS.entries()) {
    const index = offset + 1;
    const stepStart = Date.now();
    const stopSpinner = startSpinner(index, step, stepStart);

    if (!verbose && !isInteractive) {
      printStepStart(index, step);
    }

    try {
      await runStep(step);
      stopSpinner();
      if (!verbose) {
        printStepDone(index, step, stepStart);
      }
    } catch (error) {
      stopSpinner();
      if (!verbose) {
        printFailure(index, step, error.output ?? '', stepStart);
      }

      process.exitCode = 1;
      return;
    }
  }

  if (!verbose) {
    process.stdout.write(
      `\n${formatPrefix(totalSteps)}  ${buildProgressBar(totalSteps)}  ${colorize(
        'verify complete',
        ANSI.green
      )} in ${colorize(formatDuration(verifyStart), ANSI.bold)}\n`
    );
  }
}

await main();
