import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RegisterResponse {
  usuario: Usuario;
  token: string;
}
interface Usuario {
  name: string;
  email: string;
  phone: string;
  username: string;
  role: string;
  uid: string;
  imageUrl: string;
  type_company?: string;
  profile_img?: string;
}

interface AuthState {
  isLoggedIn: boolean;
  token: string | null;
  user: Omit<Usuario, 'token'> | null;
}

const initialState: AuthState = {
  isLoggedIn: false,
  token: null,
  user: null,
};

export const authSlice = createSlice({
  name: 'authState',
  initialState,
  reducers: {
    setSignIn: (state, action: PayloadAction<RegisterResponse>) => {
      state.isLoggedIn = true;
      state.token = action.payload.token;
      state.user = action.payload.usuario;
    },
    setSignOut: state => {
      state.isLoggedIn = false;
      state.token = null;
      state.user = null;
    },
  },
});

export const { setSignIn, setSignOut } = authSlice.actions;

export const selectIsLoggedIn = (state: { authState: AuthState }) =>
  state.authState.isLoggedIn;

export const selectToken = (state: { authState: AuthState }) =>
  state.authState.token;

export const selectUser = (state: { authState: AuthState }) =>
  state.authState.user;

export const selectUserRole = (state: { authState: AuthState }) =>
  state.authState.user?.role;

export const selectUserProfile = (state: { authState: AuthState }) => {
  const { imageUrl, profile_img } = state.authState.user || {};
  return profile_img || imageUrl;
};

export default authSlice.reducer;
