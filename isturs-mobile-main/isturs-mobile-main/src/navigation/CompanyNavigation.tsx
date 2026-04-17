
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeCompanyScreen from '../views/app/CompanyScreen/HomeCompanyScreen';
import { useSelector } from 'react-redux';
import { selectTheme } from '../redux/slices/app.slice';
import { colors } from '../theme';
import { HomeCompanyStackParamList } from './types';
import TouristsInProgressScreen from '../views/app/CompanyScreen/TouristsInProgressScreen';
import ListOfTransferorsScreen from '../views/app/CompanyScreen/ListOfTransferorsScreen';
import TouristRequests from '../views/app/CompanyScreen/TouristRequests';
import EditProfileCompany from '../views/app/CompanyScreen/EditProfileCompany';


const EmpresaStack = createNativeStackNavigator<HomeCompanyStackParamList>();

const EmpresaNavigation: React.FC = () => {
  const currentTheme = useSelector(selectTheme);

  return (
    <EmpresaStack.Navigator
      screenOptions={{
      headerShown:false}}
    >
      <EmpresaStack.Screen name="HomeScreenCompany" component={HomeCompanyScreen} />
      <EmpresaStack.Screen name="TouristsInProgress" component={TouristsInProgressScreen} />
      <EmpresaStack.Screen name="ListOfTransferorsScreen" component={ListOfTransferorsScreen} />
      <EmpresaStack.Screen name="TouristRequestsScreen" component={TouristRequests} />
      <EmpresaStack.Screen name="EditProfileCompanyScreen" component={EditProfileCompany} />
   
    </EmpresaStack.Navigator>
  );
};

export default EmpresaNavigation;
