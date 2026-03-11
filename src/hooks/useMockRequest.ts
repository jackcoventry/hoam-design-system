import { useCallback, useState } from 'react';

export type MockResponse<T> = T | (() => T);

export type MockOptions<T> = {
  delay?: number;
  shouldFail?: boolean;
  response: MockResponse<T>;
};

export type UseMockRequestReturn<T> = {
  data: T | null;
  loading: boolean;
  error: Error | null;
  run: (options: MockOptions<T>) => Promise<T>;
  reset: () => void;
};

function resolveMockResponse<T>(response: MockResponse<T>): T {
  return typeof response === 'function' ? (response as () => T)() : response;
}

export function useMockRequest<T = unknown>(): UseMockRequestReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const run = useCallback<UseMockRequestReturn<T>['run']>((options) => {
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

        const result = resolveMockResponse(response);

        setData(result);
        setLoading(false);
        resolve(result);
      }, delay);
    });
  }, []);

  const reset = useCallback((): void => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, run, reset };
}
