// navigation/Navigation.tsx
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {selectToken, selectUserRole} from '../redux/slices/auth.slice';
import CommonNavigation from './CommonNavigation';

import AuthStack from './Auth';
import EmpresaNavigation from './CompanyNavigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Toast from '../services/AlertServices/Toast';
import CommonCompanyNavigator from './CommonCompanyNavigator';
export type HomeStackParamList = {
  Home: undefined;
  About: undefined;
  Settings: {
    id: string;
  };
};

export type HomeScreenNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  'Home'
>;

export default function Navigation() {
  const token = useSelector(selectToken);
  const role = useSelector(selectUserRole);

  
  return (
    <NavigationContainer>
      {!token ? (
        <AuthStack />
      ) : role === 'COMPANY' ? (
        <CommonCompanyNavigator />
      ) : (
        <CommonNavigation />
      )}

    </NavigationContainer>
  );
}
