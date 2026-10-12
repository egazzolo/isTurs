import { useState, useEffect, useCallback, useRef } from 'react';
import { AppState } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import axiosClient from '../api';

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

interface FetchOptions {
  // While the screen is focused, quietly refetch every pollMs milliseconds.
  pollMs?: number;
}

function useGetFetch<T>(
  endpoint: string,
  options?: FetchOptions,
): FetchState<T> & {
  refreshData: () => Promise<void>;
  reloadData: () => Promise<void>;
} {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  // silent fetches keep the current data on screen (no loader, no clearing on error)
  const fetchData = useCallback(async (silent = false) => {
    if (silent && !endpoint) return;
    if (!silent) setState(prevState => ({ ...prevState, loading: true }));
    try {
      const response = await axiosClient.get<T>(endpoint);
      setState({ data: response.data, loading: false, error: null });
    } catch (error) {
      if (silent) return;
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error : new Error('An error occurred'),
      });
    }
  }, [endpoint]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Refetch when coming back to this screen or to the app, and poll while visible,
  // so changes made on other phones show up without reopening the app.
  const isFirstFocus = useRef(true);
  const pollMs = options?.pollMs;
  useFocusEffect(
    useCallback(() => {
      if (isFirstFocus.current) {
        isFirstFocus.current = false;
      } else {
        fetchData(true);
      }
      const appStateSub = AppState.addEventListener('change', next => {
        if (next === 'active') fetchData(true);
      });
      const timer = pollMs ? setInterval(() => fetchData(true), pollMs) : null;
      return () => {
        appStateSub.remove();
        if (timer) clearInterval(timer);
      };
    }, [fetchData, pollMs]),
  );

  const refreshData = useCallback(() => {
    return fetchData();
  }, [fetchData]);

  // Like refreshData but without the full-screen loader (used by pull-to-refresh).
  const reloadData = useCallback(() => fetchData(true), [fetchData]);

  return { ...state, refreshData, reloadData };
}

export default useGetFetch;
