import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../views/auth/Login';
import {useSelector} from 'react-redux';
import {selectTheme} from '../redux/slices/app.slice';
import {colors} from '../theme';
import RegisterCompany from '../views/auth/RegisterCompany';

import RegisterOperator from '../views/auth/RegisterOperator';
import { AuthStackParamList } from './types';
import RegisterTurist from '../views/auth/RegisterTurist';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthStack() {
  const currentTheme = useSelector(selectTheme);
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: colors[currentTheme].background,
          },
          headerTitleStyle: {
            color: colors[currentTheme].text,
          },
        }}>
        <Stack.Screen
          name="Login"
          options={{ headerShown:false}}
          component={LoginScreen}
        />
        <Stack.Screen
          name="RegisterCompanyScreen"
          options={{ headerShown:false}}
          component={RegisterCompany}
        />
        <Stack.Screen
          name="RegisterTuristScreen"
          options={{ headerShown:false}}
          component={RegisterTurist}
        />
        <Stack.Screen
          name="RegisterOperatorScreen"
          options={{ headerShown:false}}
          component={RegisterOperator}
        />
      
      </Stack.Navigator>
      
    </NavigationContainer>
  );
}
