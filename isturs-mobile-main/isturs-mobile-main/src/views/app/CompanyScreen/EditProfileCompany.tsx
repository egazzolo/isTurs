import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {Background} from '../../../components/Background/Background';
import CustomInput from '../../../components/CustomInput/CustomInput';
import {CustomButton} from '../../../components/CustomButton/CustomButton';
import AppImages from '../../../assets/icon';
import {sizeMargin} from '../../../constants';
import {ScrollView} from 'react-native-gesture-handler';
import {useSelector} from 'react-redux';
import { selectUser, selectUserProfile, selectUserRole, } from '../../../redux/slices/auth.slice';
import Alert from '../../../services/Alert';
import usePut from '../../../hook/usePut';
import FullScreenLoader from '../../../components/UI/FullScreenLoader';
import { useNavigation } from '@react-navigation/native';
import { err } from 'react-native-svg';
import {useTranslation} from '../../../i18n';

interface FormState {
  name: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

function EditProfileCompany() {
  const {t} = useTranslation();
  const userData = useSelector(selectUser);
  const navigation = useNavigation();
  const userRole = useSelector(selectUserRole);
  const [formState, setFormState] = useState({
    name: userData?.name || '',
    email: userData?.email || '',
    username: userData?.username || '',
    password: '',
    confirmPassword: '',
  });

  console.log(userData);

  const {putData, isLoading, error} = usePut({
    onSuccess: data => {
      Alert.success(t.profileUpdated);
      navigation.goBack();
    },
    onError: error => {
      console.log(error.response.data)

      if (error.response.data){
        Alert.warning(error.response.data.msg)
      } else {

        Alert.warning(t.profileUpdateError);
      }
    },
  });

  const handleInputChange = (name: keyof FormState, value: string) => {
    setFormState(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    if (formState.password !== formState.confirmPassword) {
      Alert.info(t.passwordsDoNotMatch);
      return;
    }

  
    const { confirmPassword, ...updateData } = formState;
    putData(`/user/${userData?.uid}`, updateData);
  };


  return (
    <>
      <Background xml={AppImages.BACKGROUND} darkOverlay />
      <ScrollView style={{flex: 1}}>
        <View style={styles.container}>
          <View style={styles.titleContainer}>
            <Text style={styles.textTitle}>{t.edit} {userRole === "OPERATOR" ? t.operatorHomeRole : t.touristRole}</Text>
          </View>
          <View style={styles.overlayContent}>
            <CustomInput
              placeholder={t.name}
              value={formState.name}
              onChangeText={value => handleInputChange('name', value)}
            />
            <CustomInput
              placeholder={t.email}
              value={formState.email}
              onChangeText={value => handleInputChange('email', value)}
            />
            <CustomInput
              placeholder={t.username}
              value={formState.username}
              onChangeText={value => handleInputChange('username', value)}
            />
            <CustomInput
              placeholder={t.password}
              secureTextEntry
              isSecure
              onChangeText={value => handleInputChange('password', value)}
            />
            <CustomInput
              placeholder={t.confirmPassword}
              secureTextEntry
              isSecure
              onChangeText={value =>
                handleInputChange('confirmPassword', value)
              }
            />
            <CustomButton title={t.edit} onPress={handleUpdate} />
          </View>
        </View>
        <FullScreenLoader visible={isLoading}/>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayContent: {
    width: '100%',
    alignItems: 'center',

    paddingVertical: sizeMargin['spacing-m'],
    paddingHorizontal: sizeMargin['spacing-s'],
    gap: 30,
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

export default EditProfileCompany;