import { useCallback, useState } from 'react';

type MockOptions<T> = {
  delay?: number;
  shouldFail?: boolean;
  response?: T | (() => T);
};

export function useMockRequest<T = unknown>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const run = useCallback(async (options: MockOptions<T>) => {
    const { delay = 1000, shouldFail = false, response } = options;

    setLoading(true);
    setError(null);

    return new Promise<T>((resolve, reject) => {
      setTimeout(() => {
        if (shouldFail) {
          const err = new Error('Mock request failed');
          setError(err);
          setLoading(false);
          reject(err);
          return;
        }

        const result = typeof response === 'function' ? (response as () => T)() : response;

        setData(result);
        setLoading(false);
        resolve(result);
      }, delay);
    });
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, run, reset };
}
