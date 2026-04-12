import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  selectUser,
  setSignIn,
} from '../../redux/slices/auth.slice';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Button,
  ScrollView,
} from 'react-native';
import {RenderSvgXML} from '../../components/RenderSvgXML';
import AppImages from '../../assets/icon';
import {Background} from '../../components/Background/Background';
import {sizeMargin} from '../../constants';
import CustomInput from '../../components/CustomInput/CustomInput';
import {CustomButton} from '../../components/CustomButton/CustomButton';
import {SIZES_MEDIUM} from '../../constants/fonts';
import {AuthStackParamList} from '../../navigation/types';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import CustomModal from '../../components/CustomModal/CustomModal';
import usePost from '../../hook/usePostFetch';
import Alert from '../../services/Alert';
import FullScreenLoader from '../../components/UI/FullScreenLoader';
import {useTranslation} from '../../i18n';
import LanguageSelector from '../../components/LanguageSelector/LanguageSelector';

type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export interface RegisterResponse {
  usuario: Usuario;
  token: string;
}

export interface Usuario {
  name: string;
  email: string;
  phone: string;
  username: string;
  role: string;
  uid: string;
  imageUrl: string;
}

const IMAGE_URL_PLACEHOLDER =
  'https://surgassociates.com/wp-content/uploads/610-6104451_image-placeholder-png-user-profile-placeholder-image-png.jpg';

const initialFormState = {
  username: '',
  password: '',
};

export default function HomeScreen({navigation}: LoginScreenProps) {
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState<
    keyof AuthStackParamList | null
  >(null);
  const [accessCode, setAccessCode] = useState('');
  const [formState, setFormState] = useState(initialFormState);
  const user = useSelector(selectUser);

  console.log(user, 'userrr');

  const handleChange = (name: any, value: any) => {
    setFormState(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const {postData, data, isLoading} = usePost<RegisterResponse>({
    onSuccess: () => {},
    onError: error => {
      Alert.warning(error.response.data.msg);
    },
  });

  useEffect(() => {
    if (!isLoading && data) {
      Alert.success(t.loginSuccess);
      dispatch(
        setSignIn({
          usuario: {
            ...data.usuario,
            imageUrl: IMAGE_URL_PLACEHOLDER,
          },
          token: data.token,
        }),
      );
    }
  }, [data, isLoading, navigation, dispatch]);

  const doLogin = () => {
    postData('/auth/login', {
      username: formState.username,
      password: formState.password,
    });
  };

  const handleRegisterPress = () => {
    setModalVisible(true);
    setAccessCode('');
  };

  const handleOptionSelect = (option: keyof AuthStackParamList) => {
    setSelectedOption(option);
    if (option === 'RegisterTuristScreen') {
      navigation.navigate(option);
      cleanUpStates();
    }
  };

  const verifyAccessCode = () => {
    if (accessCode === '54321' && selectedOption) {
      navigation.navigate(selectedOption);
      cleanUpStates();
    } else {
      console.log('Código incorrecto, intenta nuevamente.');
    }
  };

  const cleanUpStates = () => {
    setModalVisible(false);
    setSelectedOption(null);
    setAccessCode('');
  };

  return (
    <ScrollView
      contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}
      style={{flex: 1}}>
      <Background xml={AppImages.BACKGROUND} darkOverlay />
      <View style={styles.container}>
        <View style={styles.overlayContent}>
          <LanguageSelector variant="light" />
          <Text style={styles.tagline}>{t.tagline}</Text>
          <View style={styles.logoContainer}>
            <RenderSvgXML
              xml={AppImages.LOGO_ISTURS}
              width={170}
              height={170}
            />
          </View>
          <CustomInput
            placeholder={t.username}
            onChangeText={value => handleChange('username', value)}
          />
          <CustomInput
            placeholder={t.password}
            isSecure={true}
            onChangeText={value => handleChange('password', value)}
          />
          <CustomButton title={t.login} onPress={doLogin} />
          <CustomButton title={t.register} onPress={handleRegisterPress} invert />
          <TouchableOpacity>
            <Text style={styles.tagline}>{t.forgotPassword}</Text>
          </TouchableOpacity>
        </View>
        <CustomModal isVisible={isModalVisible} onClose={cleanUpStates}>
          {!selectedOption && (
            <>
              <CustomButton
                title={t.company}
                onPress={() => handleOptionSelect('RegisterCompanyScreen')}
                invert
              />
              <CustomButton
                title={t.operator}
                onPress={() => handleOptionSelect('RegisterOperatorScreen')}
                invert
              />
              <CustomButton
                title={t.tourist}
                onPress={() => handleOptionSelect('RegisterTuristScreen')}
              />
            </>
          )}
          {selectedOption && selectedOption !== 'RegisterTuristScreen' && (
            <View>
              <TextInput
                placeholder={t.enterCode}
                placeholderTextColor={'black'}
                value={accessCode}
                onChangeText={setAccessCode}
                style={styles.input}
              />
              <Button title={t.verifyCode} onPress={verifyAccessCode} />
            </View>
          )}
        </CustomModal>
      </View>
      <FullScreenLoader visible={isLoading} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayContent: {
    alignItems: 'center',
    position: 'absolute',
    paddingVertical: sizeMargin['spacing-m'],
    paddingHorizontal: sizeMargin['spacing-s'],
    gap: 30,
  },
  logoContainer: {
    backgroundColor: 'white',
    borderRadius: 170 / 2,
  },
  tagline: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: SIZES_MEDIUM.XMEDIUM,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    width: 200,
    color: 'black',
  },
});
