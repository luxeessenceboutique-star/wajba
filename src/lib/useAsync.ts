import { useCallback, useEffect, useState } from "react";

export interface AsyncState<T> {
  data: T | undefined;
  error: unknown;
  loading: boolean;
  reload: () => void;
}

/**
 * Runs `load` when `key` changes and tracks loading / error / data.
 * `key` must change whenever the request changes (e.g. the kitchen id).
 * With `keepPrevious`, the last data stays visible while the next request runs (search as you type).
 */
export function useAsync<T>(key: string, load: () => Promise<T>, { keepPrevious = false } = {}): AsyncState<T> {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{ key: string; attempt: number; data?: T; error?: unknown } | null>(null);

  useEffect(() => {
    let alive = true;
    load().then(
      (data) => alive && setResult({ key, attempt, data }),
      (error: unknown) => alive && setResult({ key, attempt, error }),
    );
    return () => {
      alive = false;
    };
    // `load` is recreated every render; `key` and `attempt` identify the request.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, attempt]);

  const reload = useCallback(() => setAttempt((a) => a + 1), []);
  const current = result && result.key === key && result.attempt === attempt ? result : null;
  return { data: current ? current.data : keepPrevious ? result?.data : undefined, error: current?.error, loading: !current, reload };
}
