import { afterEach, describe, expect, it, vi } from 'vitest';

async function loadLoggerModule(isDev: boolean) {
  vi.resetModules();

  vi.doMock('@/utils/env', () => ({
    __DEV__: isDev,
  }));

  return import('@/utils/logger');
}

describe('logger', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
    vi.doUnmock('@/utils/env');
  });

  describe('log', () => {
    it('calls console.log with the prefix and args in development', async () => {
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const { logger } = await loadLoggerModule(true);

      logger.log('hello', 123, { ok: true });

      expect(logSpy).toHaveBeenCalledTimes(1);
      expect(logSpy).toHaveBeenCalledWith('[HOAM]', 'hello', 123, { ok: true });
    });

    it('does not call console.log outside development', async () => {
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const { logger } = await loadLoggerModule(false);

      logger.log('hello');

      expect(logSpy).not.toHaveBeenCalled();
    });
  });

  describe('warn', () => {
    it('calls console.warn with a formatted message in development', async () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const { logger } = await loadLoggerModule(true);

      logger.warn('Something happened');

      expect(warnSpy).toHaveBeenCalledTimes(1);
      expect(warnSpy).toHaveBeenCalledWith('[HOAM] Something happened');
    });

    it('does not call console.warn outside development', async () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const { logger } = await loadLoggerModule(false);

      logger.warn('Something happened');

      expect(warnSpy).not.toHaveBeenCalled();
    });
  });

  describe('error', () => {
    it('throws an Error with the formatted message', async () => {
      const { logger } = await loadLoggerModule(true);

      expect(() => logger.error('Boom')).toThrowError('[HOAM] Boom');
    });

    it('throws regardless of development mode', async () => {
      const { logger } = await loadLoggerModule(false);

      expect(() => logger.error('Boom')).toThrowError('[HOAM] Boom');
    });
  });

  describe('invariant', () => {
    it('does not throw when the condition is truthy', async () => {
      const { logger } = await loadLoggerModule(true);

      expect(() => logger.invariant(true, 'Should not throw')).not.toThrow();
      expect(() => logger.invariant('value', 'Should not throw')).not.toThrow();
      expect(() => logger.invariant(123, 'Should not throw')).not.toThrow();
    });

    it('throws when the condition is falsy', async () => {
      const { logger } = await loadLoggerModule(true);

      expect(() => logger.invariant(false, 'Invalid state')).toThrowError('[HOAM] Invalid state');
    });

    it('throws for other falsy values', async () => {
      const { logger } = await loadLoggerModule(true);

      expect(() => logger.invariant(0, 'Zero is invalid')).toThrowError('[HOAM] Zero is invalid');
      expect(() => logger.invariant('', 'Empty is invalid')).toThrowError(
        '[HOAM] Empty is invalid'
      );
      expect(() => logger.invariant(null, 'Null is invalid')).toThrowError(
        '[HOAM] Null is invalid'
      );
      expect(() => logger.invariant(undefined, 'Undefined is invalid')).toThrowError(
        '[HOAM] Undefined is invalid'
      );
    });
  });

  describe('named invariant export', () => {
    it('matches the logger invariant behaviour', async () => {
      const mod = await loadLoggerModule(true);

      expect(() => mod.invariant(false, 'Broken')).toThrowError('[HOAM] Broken');
      expect(() => mod.invariant(true, 'Fine')).not.toThrow();
    });
  });
});
