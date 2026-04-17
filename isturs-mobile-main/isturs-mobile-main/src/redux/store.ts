import {configureStore} from '@reduxjs/toolkit';
import AuthReducer from '../redux/slices/auth.slice';
import ToastReducer from '../redux/slices/toast.slice';
import AppReducer from '../redux/slices/app.slice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {combineReducers} from 'redux';
import {persistReducer} from 'redux-persist';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

const reducers = combineReducers({
  authState: AuthReducer,
  appState: AppReducer,
  toastSlice: ToastReducer,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  toastSlice: ToastReducer,
  whitelist: ['authState', 'appState',"toastSlice"],
  blacklist: [],
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  devTools: true,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});


export type RootState = ReturnType<typeof store.getState>;


export type AppDispatch = typeof store.dispatch;


export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
