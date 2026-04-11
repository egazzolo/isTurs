// navigation/TouristAndTranslatorNavigation.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../views/app/TouristAndTranslatorScreens/Home';
import EditProfileUser from '../views/app/TouristAndTranslatorScreens/EditProfileUser';
import { HomeStackParamList } from './types';
import DetailsTranslator from '../views/app/TouristAndTranslatorScreens/DetailsTranslator';


const HomeStack = createNativeStackNavigator<HomeStackParamList>();

const TouristAndTranslatorNavigation: React.FC = () => {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeScreen" component={HomeScreen} />
      <HomeStack.Screen name="EditProfileScreen" component={EditProfileUser} />
      <HomeStack.Screen name="DetailsTranslado" component={DetailsTranslator} />
    </HomeStack.Navigator>
  );
};

export default TouristAndTranslatorNavigation;
