import { useState } from 'react';
import axiosClient from '../api';

interface UsePutOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

interface UsePutResult<T> {
  putData: (endpoint: string, data: any) => Promise<void>;
  data: T | null;
  isLoading: boolean;
  error: any;
}

function usePut<T>(options?: UsePutOptions): UsePutResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  const putData = async (endpoint: string, updateData: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosClient.put<T>(endpoint, updateData);
      setData(response.data);
      if (options?.onSuccess) {
        options.onSuccess(response.data);
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

  return { putData, data, isLoading, error };
}

export default usePut;
