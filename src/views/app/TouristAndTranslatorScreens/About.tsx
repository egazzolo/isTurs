import * as React from 'react';
import {useNavigation} from '@react-navigation/native';

import Container from '../../../components/Container';
import Text from '../../../components/Text';
import Button from '../../../components/Button';
import { HomeScreenNavigationProp } from '../../../navigation/App';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';
import { setSignOut } from '../../../redux/slices/auth.slice';

export default function AboutScreen() {
  const navigate = useNavigation<HomeScreenNavigationProp>();
  const dispatch = useDispatch();

  const logout = () => {
    dispatch(setSignOut());
    // navigation.navigate('EditProfileScreen');
  };

  return (
    <View style={{backgroundColor:"red", flex:1}}>
      
      <Button onPress={logout}>
        <Text buttonText>Cerrar sesion</Text>
      </Button>
    </View>
  );
}
