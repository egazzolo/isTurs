import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useDispatch, useSelector} from 'react-redux';

import Text from '../../../components/Text';
import Button from '../../../components/Button';
import {selectTheme, setTheme} from '../../../redux/slices/app.slice';
import {colors} from '../../../theme';
import Container from '../../../components/Container';
import { HomeScreenNavigationProp } from '../../../navigation/App';
import {useTranslation} from '../../../i18n';
import LanguageSelector from '../../../components/LanguageSelector/LanguageSelector';

export default function SettingScreen() {
  const {t} = useTranslation();
  const navigate = useNavigation<HomeScreenNavigationProp>();
  const currentTheme = useSelector(selectTheme);
  const dispatch = useDispatch();
  const changeTheme = () => {
    dispatch(setTheme(currentTheme === 'light' ? 'dark' : 'light'));
  };

  const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      gap: 10,
    },
  });
  return (
    <Container>
      <Text>{t.settings}</Text>
      <Button onPress={() => navigate.goBack()}>
        <Text buttonText>{t.back}</Text>
      </Button>
      <Button onPress={changeTheme}>
        {currentTheme === 'light' ? (
          <View style={styles.container}>
            <Text buttonText>{t.darkMode}</Text>
            <Icon
              name="dark-mode"
              size={20}
              color={colors[currentTheme].buttonText}
            />
          </View>
        ) : (
          <View style={styles.container}>
            <Text buttonText>{t.lightMode}</Text>
            <Icon
              name="light-mode"
              size={20}
              color={colors[currentTheme].buttonText}
            />
          </View>
        )}
      </Button>
      <LanguageSelector variant="dark" />
    </Container>
  );
}
