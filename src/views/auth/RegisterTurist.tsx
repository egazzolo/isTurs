import {View, Text, StyleSheet, ScrollView} from 'react-native';
import React, {useState} from 'react';
import {Background} from '../../components/Background/Background';
import AppImages from '../../assets/icon';
import CustomInput from '../../components/CustomInput/CustomInput';
import {CustomButton} from '../../components/CustomButton/CustomButton';
import {sizeMargin} from '../../constants';
import CustomCheckbox from '../../components/CustomCheckbox/CustomCheckbox';
import usePost from '../../hook/usePostFetch';
import Alert from '../../services/Alert';
import {useNavigation} from '@react-navigation/native';
import FullScreenLoader from '../../components/UI/FullScreenLoader';
import {useTranslation} from '../../i18n';

interface RegisterResponse {
  name: string;
  email: string;
  username: string;
  role: string;
  uid: string;
}

const initialFormState = {
  name: '',
  email: '',
  phone: '',
  username: '',
  password: '',
  confirmPassword: '',
  isChecked: false,
};

export default function RegisterTurist() {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const [formState, setFormState] = useState(initialFormState);

  const handleChange = (name: any, value: any) => {
    setFormState(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const {postData, isLoading} = usePost<RegisterResponse>({
    onSuccess: () => {
      Alert.success(t.registrationSuccess);
      navigation.goBack();
      setFormState(initialFormState);
    },
    onError: error => Alert.warning(error.response.data.errors[0].msg),
  });

  const handleSubmmit = () => {
    if (
      !formState.name.trim() ||
      !formState.email.trim() ||
      !formState.phone.trim() ||
      !formState.username.trim() ||
      !formState.password.trim() ||
      !formState.confirmPassword.trim()
    ) {
      Alert.info(t.allFieldsRequired);
      return;
    }

    if (!formState.email.includes('@')) {
      Alert.info(t.invalidEmail);
      return;
    }

    if (formState.password !== formState.confirmPassword) {
      Alert.info(t.passwordMismatch);
      return;
    }

    if (!formState.isChecked) {
      Alert.info(t.acceptTermsRequired);
      return;
    }

    postData('/user', {
      role: 'TURIST',
      name: formState.name,
      email: formState.email,
      phone: formState.phone,
      username: formState.username,
      password: formState.password,
    });
  };

  return (
    <>
      <Background xml={AppImages.BACKGROUND} darkOverlay />
      <ScrollView style={{flex: 1}}>
        <View style={styles.container}>
          <View style={styles.titleContainer}>
            <Text style={styles.textTitle}>{t.registration}</Text>
            <Text style={styles.textRole}>{t.tourist}</Text>
          </View>
          <View style={styles.overlayContent}>
            <CustomInput
              placeholder={t.fullName}
              onChangeText={value => handleChange('name', value)}
            />
            <CustomInput
              placeholder={t.email}
              onChangeText={value => handleChange('email', value)}
            />
            <CustomInput
              placeholder={t.phone}
              onChangeText={value => handleChange('phone', value)}
              keyboardType="numeric"
            />
            <CustomInput
              placeholder={t.username}
              onChangeText={value => handleChange('username', value)}
            />
            <CustomInput
              placeholder={t.password}
              isSecure={true}
              onChangeText={value => handleChange('password', value)}
            />
            <CustomInput
              placeholder={t.confirmPassword}
              isSecure={true}
              onChangeText={value => handleChange('confirmPassword', value)}
            />
            <CustomCheckbox
              label={t.termsAndConditions}
              checked={formState.isChecked}
              onCheck={() => handleChange('isChecked', !formState.isChecked)}
            />
            <CustomButton title={t.register} onPress={() => handleSubmmit()} />
          </View>
        </View>
        <FullScreenLoader visible={isLoading} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayContent: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: sizeMargin['spacing-xxs'],
    paddingHorizontal: sizeMargin['spacing-s'],
    gap: 20,
  },
  titleContainer: {
    paddingTop: 20,
    alignItems: 'center',
  },
  textTitle: {
    fontSize: 35,
    color: 'white',
    fontWeight: 'bold',
  },
  textRole: {
    color: '#c7c8c7',
  },
});
