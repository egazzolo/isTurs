import { View, Text, TouchableOpacity, StyleSheet, ScrollView, } from 'react-native';
import React, {useState} from 'react';
import {Background} from '../../components/Background/Background';
import AppImages from '../../assets/icon';
import {RenderSvgXML} from '../../components/RenderSvgXML';
import CustomInput from '../../components/CustomInput/CustomInput';
import {CustomButton} from '../../components/CustomButton/CustomButton';
import {SIZES_MEDIUM} from '../../constants/fonts';
import {sizeMargin} from '../../constants';
import CustomCheckbox from '../../components/CustomCheckbox/CustomCheckbox';
import CustomSelectBottomSheet from '../../components/CustomSelectBottomSheet/CustomSelectBottomSheet';
import usePost from '../../hook/usePostFetch';
import {useDispatch} from 'react-redux';
import {showToast} from '../../redux/slices/toast.slice';
import Alert from '../../services/Alert';
import {useNavigation} from '@react-navigation/native';
import FullScreenLoader from '../../components/UI/FullScreenLoader';
import {useTranslation} from '../../i18n';

interface RegisterResponse {
  name: string;
  email: string;
  username: string;
  code: string;
  type_company: string;
  company: string;
  role: string;
  uid: string;
}

const options = [
  {id: '1', name: 'Juridica'},
  {id: '2', name: 'Natural'},
];

const areAllFieldsFilled = (state: any) => {
  const requiredFields = [
    'companyName',
    'socialReason',
    'ruc',
    'cellphone',
    'username',
    'password',
    'confirmPassword',
  ];

  return requiredFields.every(field => state[field]?.trim() !== '');
};

const initialFormState = {
  companyName: '',
 
  ruc: '',
  code: '',
  username: '',
  password: '',
  email:"",
  confirmPassword: '',
  isChecked: false,
};

export default function RegisterOperator() {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [formState, setFormState] = useState(initialFormState);
  const [typeCompany, setTypeCompany] = useState('');
console.log(formState)
  const handleChange = (name: any, value: any) => {
    setFormState(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const {postData, data, isLoading, error} = usePost<RegisterResponse>({
    onSuccess: () => {
      Alert.success(t.registerSuccess);
      navigation.goBack();
      setFormState(initialFormState);
    },
    onError: error => Alert.warning(error.response.data.errors[0].msg),
  });

  const handleSubmmit = () => {
    // Verificar si todos los campos están llenos.
    if (!areAllFieldsFilled(formState) || !typeCompany) {
      Alert.info(t.allFieldsRequired);
      return;
    }


    // Verificar si las contraseñas coinciden.
    if (formState.password !== formState.confirmPassword) {
      Alert.info(t.passwordsDoNotMatch);
      return;
    }

    // Verificar si los términos y condiciones están aceptados.
    if (!formState.isChecked) {
      Alert.info(t.acceptTerms);
      return;
    }

    console.log(formState, 'formState');
    postData('/user', {
      role: 'OPERATOR',
      name: formState.companyName,
      email: formState.email,
      code: formState.code,
      type_company: typeCompany,
      // company: formState.socialReason,
      username: formState.username,
      password: formState.password,
    });
  };

  return (
    <ScrollView style={{flex: 1}}>
      <Background xml={AppImages.BACKGROUND} darkOverlay />
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.textTitle}>{t.registrationTitle}</Text>
          <Text style={styles.textRole}>{t.operatorRole}</Text>
        </View>
        <View style={styles.overlayContent}>
          <CustomInput
            placeholder={t.name}
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
            onSelect={value => {
              setTypeCompany(value.name);
            }}
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
      <FullScreenLoader visible={isLoading}/>

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
  textStyle: {
    marginTop: 20,
    fontSize: 18,
    color: 'black',
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
