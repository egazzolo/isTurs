import {createSlice} from '@reduxjs/toolkit';
import {TTheme} from '../../theme';

interface SliceState {
  appState: {
    theme: TTheme;
    language: string;
  };
}

const initialState = {
  theme: 'light' as TTheme,
  language: 'es',
};

const authSlice = createSlice({
  name: 'appState',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
  },
});

export const {setTheme, setLanguage} = authSlice.actions;

export const selectTheme = (state: SliceState) => state.appState.theme;
export const selectLanguage = (state: SliceState) => state.appState.language;

export default authSlice.reducer;
