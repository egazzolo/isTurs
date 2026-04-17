import {createSlice} from '@reduxjs/toolkit';
import {TTheme} from '../../theme';

type Language = 'es' | 'en' | 'pt';

interface SliceState {
  appState: {
    theme: TTheme;
    language: Language;
  };
}

const initialState = {
  theme: 'light',
  language: 'es' as Language,
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