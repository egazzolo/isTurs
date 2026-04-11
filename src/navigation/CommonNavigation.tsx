// navigation/CommonNavigation.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../views/app/TouristAndTranslatorScreens/Home';
import AboutScreen from '../views/app/TouristAndTranslatorScreens/About';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useSelector } from 'react-redux';
import { selectTheme } from '../redux/slices/app.slice';
import { colors } from '../theme';
import TouristAndTranslatorNavigation from './TouristAndTranslatorNavigation';
import { selectUserRole } from '../redux/slices/auth.slice';

const CommonTab = createBottomTabNavigator();

const CommonNavigation: React.FC = () => {
  const currentTheme = useSelector(selectTheme);
const userRole = useSelector(selectUserRole);

console.log(userRole)
  function TabBarIcon({focused, color, size, route}: any) {
    let iconName = '';
  
    if (route.name === 'Home') {
      iconName = focused ? 'home' : 'home-outline';
    } else if (route.name === 'About') {
      iconName = focused ? 'help-circle' : 'help-circle-outline';
    }
  
    return <Icon name={iconName} size={size} color={color} />;
  }



  const tabBarVisible = userRole === 'TURIST';

  return (
    <CommonTab.Navigator
      screenOptions={({ route }) => ({
        headerShown:false,
        tabBarIcon: ({ focused, color, size }) =>
          TabBarIcon({ focused, color, size, route }),
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors[currentTheme].active,
        tabBarInactiveTintColor: colors[currentTheme].inactive,
        tabBarActiveBackgroundColor: colors[currentTheme].background,
        tabBarInactiveBackgroundColor: colors[currentTheme].background,
        tabBarStyle: { display: tabBarVisible ? 'none' : 'none' }, 
      })}
    >
      <CommonTab.Screen name="Home" component={TouristAndTranslatorNavigation} />
      <CommonTab.Screen name="About" component={AboutScreen} />
      {/* Otros componentes de pestañas si son necesarios */}
    </CommonTab.Navigator>
  );
};

export default CommonNavigation;
