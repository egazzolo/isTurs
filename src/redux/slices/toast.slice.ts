// features/toast/toastSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ToastState {
  isVisible: boolean;
  message: string;
  type: number;
}

const initialState: ToastState = {
  isVisible: false,
  message: '',
  type: 0,
};

export const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    showToast: (state, action: PayloadAction<{ type: number; message: string }>) => {
      state.isVisible = true;
      state.message = action.payload.message;
      state.type = action.payload.type;
    },
    hideToast: (state) => {
      state.isVisible = false;
      state.message = '';
      state.type = 0;
    },
  },
});

export const { showToast, hideToast } = toastSlice.actions;

export default toastSlice.reducer;
