import {View, Text, StyleSheet, ScrollView} from 'react-native';
import React, {useState} from 'react';
import {Background} from '../../components/Background/Background';
import AppImages from '../../assets/icon';
import CustomInput from '../../components/CustomInput/CustomInput';
import {CustomButton} from '../../components/CustomButton/CustomButton';
import {sizeMargin} from '../../constants';
import CustomCheckbox from '../../components/CustomCheckbox/CustomCheckbox';
import CustomSelectBottomSheet from '../../components/CustomSelectBottomSheet/CustomSelectBottomSheet';
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
  companyName: '',
  ruc: '',
  code: '',
  username: '',
  password: '',
  email: '',
  confirmPassword: '',
  isChecked: false,
};

export default function RegisterOperator() {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const [formState, setFormState] = useState(initialFormState);
  const [typeCompany, setTypeCompany] = useState('');

  const options = [
    {id: '1', name: t.juridica},
    {id: '2', name: t.natural},
  ];

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
      !formState.companyName.trim() ||
      !formState.ruc.trim() ||
      !formState.username.trim() ||
      !formState.password.trim() ||
      !formState.confirmPassword.trim() ||
      !typeCompany
    ) {
      Alert.info(t.allFieldsRequired);
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
      role: 'OPERATOR',
      name: formState.companyName,
      email: formState.email,
      code: formState.code,
      type_company: typeCompany,
      username: formState.username,
      password: formState.password,
    });
  };

  return (
    <ScrollView style={{flex: 1}}>
      <Background xml={AppImages.BACKGROUND} darkOverlay />
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.textTitle}>{t.registration}</Text>
          <Text style={styles.textRole}>{t.operator}</Text>
        </View>
        <View style={styles.overlayContent}>
          <CustomInput
            placeholder={t.fullName}
            onChangeText={value => handleChange('companyName', value)}
          />
          <CustomInput
            placeholder={t.email}
            onChangeText={value => handleChange('email', value)}
          />
          <CustomInput
            placeholder={t.travelAgency}
            onChangeText={value => handleChange('ruc', value)}
          />
          <CustomInput
            placeholder={t.code}
            onChangeText={value => handleChange('code', value)}
          />
          <CustomSelectBottomSheet
            textButton={t.companyType}
            items={options}
            onSelect={value => setTypeCompany(value.name)}
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
