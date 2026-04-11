import { useState } from 'react';
import axiosClient from '../api';

interface UsePostOptions {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

interface UsePostResult<T> {
  postData: (endpoint: string, data: any) => Promise<void>;
  data: T | null;
  isLoading: boolean;
  error: any;
}

function usePost<T>(options?: UsePostOptions): UsePostResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  const postData = async (endpoint: string, data: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosClient.post<T>(endpoint, data);
      setData(response.data);
      if (options?.onSuccess) {
        options.onSuccess();
      }
    } catch (error) {
      setError(error);
      if (options?.onError) {
        options.onError(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { postData, data, isLoading, error };
}

export default usePost;
