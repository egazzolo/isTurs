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
import EmpresaNavigation from './CompanyNavigation';
import HistoryScreen from '../views/app/CompanyScreen/HistoryScreen';

const CommonTab = createBottomTabNavigator();

const CommonCompanyNavigator: React.FC = () => {
  const currentTheme = useSelector(selectTheme);
const userRole = useSelector(selectUserRole);

console.log(userRole)
  function TabBarIcon({focused, color, size, route}: any) {
    let iconName = '';
  
    if (route.name === 'Home') {
      iconName = focused ? 'home' : 'home-outline';
    } else if (route.name === 'HistoryScreen') {
      iconName = focused ? 'history' : 'history';
    }
  
    return <Icon name={iconName} size={size} color={color} />;
  }



  const tabBarVisible = userRole === 'COMPANY';

  return (
    <CommonTab.Navigator
      screenOptions={({ route }) => ({
        headerShown:false,
        tabBarIcon: ({ focused, color, size }) =>
          TabBarIcon({ focused, color, size, route }),
        
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors[currentTheme].active,
        tabBarInactiveTintColor: colors[currentTheme].inactive,
        tabBarActiveBackgroundColor: colors[currentTheme].background,
        tabBarInactiveBackgroundColor: colors[currentTheme].background,
        tabBarStyle: {
          display: tabBarVisible ? 'flex' : 'none',
          height: 60, // Increased height for better touch area
          position: 'absolute', // Positioning over the screen
          bottom: 0,
          left: 0,
          right: 0,
          borderTopRightRadius: 10, // Rounded top right corner
          borderTopLeftRadius: 10, // Rounded top left corner
          elevation: 20, // Shadow for Android
          shadowColor: '#000', // Shadow color for iOS
          shadowOffset: { width: 0, height: -1 }, // Shadow position for iOS
          shadowOpacity: 0.1, // Shadow opacity for iOS
          shadowRadius: 10, // Shadow blur for iOS
          backgroundColor: colors[currentTheme].background, // Optional, if you have a specific background color in mind
          paddingHorizontal: 10, // Horizontal padding
          paddingBottom: 10, // Padding at the bottom to lift the icons up within the rounded container
        },
        
      })}
    >
      <CommonTab.Screen name="Home" component={EmpresaNavigation} options={{
        title:"Inicio"
      }} />
      <CommonTab.Screen name="HistoryScreen" component={HistoryScreen} options={{
        title:"Historial"
      
      }} />
      {/* Otros componentes de pestañas si son necesarios */}
    </CommonTab.Navigator>
  );
};

export default CommonCompanyNavigator;
