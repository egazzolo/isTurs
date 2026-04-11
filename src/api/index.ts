import axios from 'axios';
import { API_URL } from '../constants';
import { setSignIn, setSignOut } from '../redux/slices/auth.slice';
import store from '../redux/store';

const defaultOptions = {
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
};

let axiosClient = axios.create(defaultOptions);

axiosClient.interceptors.request.use(function (config) {
  const state = store.getState();
  const token = state.authState.token;

  if (token) {
    config.headers['access_token'] = `${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark this request as retried

      try {
        const state = store.getState();
        const refreshToken = state.authState.token;
        const response = await axiosClient.post('/auth/refreshToken', {
          token: refreshToken
        });

        store.dispatch(setSignIn({ token: response.data.token, usuario: response.data.usuario }));
        originalRequest.headers['access_token'] = response.data.token;

        return axiosClient(originalRequest);
      } catch (refreshError) {
        store.dispatch(setSignOut());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
