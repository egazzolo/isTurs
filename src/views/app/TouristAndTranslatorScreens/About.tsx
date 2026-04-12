import * as React from 'react';
import {useNavigation} from '@react-navigation/native';
import {View} from 'react-native';
import {useDispatch} from 'react-redux';

import Container from '../../../components/Container';
import Text from '../../../components/Text';
import Button from '../../../components/Button';
import {HomeScreenNavigationProp} from '../../../navigation/App';
import {setSignOut} from '../../../redux/slices/auth.slice';
import {useTranslation} from '../../../i18n';

export default function AboutScreen() {
  const navigate = useNavigation<HomeScreenNavigationProp>();
  const dispatch = useDispatch();
  const {t} = useTranslation();

  const logout = () => {
    dispatch(setSignOut());
  };

  return (
    <View style={{backgroundColor: 'red', flex: 1}}>
      <Button onPress={logout}>
        <Text buttonText>{t.closeSession}</Text>
      </Button>
    </View>
  );
}
