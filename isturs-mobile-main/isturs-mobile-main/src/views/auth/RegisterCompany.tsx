import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
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

  return requiredFields.every(field => state[field].trim() !== '');
};

const initialFormState = {
  companyName: '',
  socialReason: '',
  ruc: '',
  cellphone: '',
  username: '',
  password: '',
  confirmPassword: '',
  isChecked: false,
};

export default function RegisterCompany() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [formState, setFormState] = useState(initialFormState);
  const [typeCompany, setTypeCompany] = useState('');

  const handleChange = (name: any, value: any) => {
    setFormState(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const {postData, data, isLoading, error} = usePost<RegisterResponse>({
    onSuccess: () => {
      Alert.success('!Registro exitoso!');
      navigation.goBack();
      setFormState(initialFormState);
    },
    onError: error => Alert.warning(error.response.data.errors[0].msg),
  });

  const handleSubmmit = () => {
    // Verificar si todos los campos están llenos.
    if (!areAllFieldsFilled(formState)) {
      Alert.info('Todos los campos son obligatorios');
      return;
    }

    // Verificar si las contraseñas coinciden.
    if (formState.password !== formState.confirmPassword) {
      Alert.info('Las contraseñas no coinciden');
      return;
    }

    // Verificar si los términos y condiciones están aceptados.
    if (!formState.isChecked) {
      Alert.info('Debes aceptar los términos y condiciones');
      return;
    }

    console.log(formState, 'formState');
    postData('/user', {
      role: 'COMPANY',
      name: formState.companyName,
      type_company: typeCompany,
      company: formState.socialReason,
      username: formState.username,
      password: formState.password,
    });
  };

  return (
    <ScrollView style={{flex: 1}}>
      <Background xml={AppImages.BACKGROUND} darkOverlay />
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.textTitle}>Registro</Text>
          <Text style={styles.textRole}>Empresa</Text>
        </View>
        <View style={styles.overlayContent}>
          <CustomInput
            placeholder="Nombre Comercial"
            onChangeText={value => handleChange('companyName', value)}
          />
          <CustomInput
            placeholder="Razón Social"
            onChangeText={value => handleChange('socialReason', value)}
          />
          <CustomInput
            placeholder="RUC"
            onChangeText={value => handleChange('ruc', value)}
          />
          <CustomInput
            placeholder="Celular"
            onChangeText={value => handleChange('cellphone', value)}
            keyboardType="numeric"
          />
          <CustomSelectBottomSheet
            textButton={'Tipo de Empresa'}
            items={options}
            onSelect={value => {
              setTypeCompany(value.name);
            }}
          />
          <CustomInput
            placeholder="Nombre de Usuario"
            onChangeText={value => handleChange('username', value)}
          />
          <CustomInput
            placeholder="Contraseña"
            isSecure={true}
            onChangeText={value => handleChange('password', value)}
          />
          <CustomInput
            placeholder="Confirmar Contraseña"
            isSecure={true}
            onChangeText={value => handleChange('confirmPassword', value)}
          />

          <CustomCheckbox
            label="Acepto los términos y condiciones"
            checked={formState.isChecked}
            onCheck={() => handleChange('isChecked', !formState.isChecked)}
          />
          <CustomButton title="Regístrate" onPress={() => handleSubmmit()} />
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
