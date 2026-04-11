import { useState, useEffect, useCallback } from 'react';
import axiosClient from '../api';

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

function useGetFetch<T>(endpoint: string): FetchState<T> & { refreshData: () => Promise<void> } {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    setState(prevState => ({ ...prevState, loading: true }));
    try {
      const response = await axiosClient.get<T>(endpoint);
      setState({ data: response.data, loading: false, error: null });
    } catch (error) {
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

  const refreshData = useCallback(() => {
    return fetchData();
  }, [fetchData]);

  return { ...state, refreshData };
}

export default useGetFetch;
