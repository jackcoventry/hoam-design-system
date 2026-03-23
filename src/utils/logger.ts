import { __DEV__ } from './env';

const PREFIX = '[HOAM]';

function formatMessage(message: string) {
  return `${PREFIX} ${message}`;
}

function log(...args: unknown[]): void {
  if (__DEV__) {
    console.log(PREFIX, ...args);
  }
}

function warn(message: string): void {
  if (__DEV__) {
    console.warn(formatMessage(message));
  }
}

function error(message: string): never {
  throw new Error(formatMessage(message));
}

function invariant(condition: unknown, message: string): asserts condition {
  if (!condition) {
    error(message);
  }
}

type Logger = {
  log: (...args: unknown[]) => void;
  warn: (message: string) => void;
  error: (message: string) => never;
  invariant: (condition: unknown, message: string) => asserts condition;
};

export const logger: Logger = {
  log,
  warn,
  error,
  invariant,
};

export { invariant };
