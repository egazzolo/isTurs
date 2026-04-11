import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {Background} from '../../../components/Background/Background';
import CustomInput from '../../../components/CustomInput/CustomInput';
import {CustomButton} from '../../../components/CustomButton/CustomButton';
import AppImages from '../../../assets/icon';
import {sizeMargin} from '../../../constants';
import {ScrollView} from 'react-native-gesture-handler';
import {useSelector} from 'react-redux';
import {
  selectUser,
  selectUserProfile,
  selectUserRole,
} from '../../../redux/slices/auth.slice';
import Alert from '../../../services/Alert';
import usePut from '../../../hook/usePut';
import FullScreenLoader from '../../../components/UI/FullScreenLoader';
import { useNavigation } from '@react-navigation/native';
interface FormState {
  name: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export default function EditProfileUser() {
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
      Alert.success('Perfil actualizado con éxito');
      navigation.goBack();
    },
    onError: error => {
      Alert.warning('Ocurrió un error al actualizar el perfil');
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
      Alert.info( 'Las contraseñas no coinciden');
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
            <Text style={styles.textTitle}>Editar {userRole === "OPERATOR" ? "Trasladista" : "Turista"}</Text>
          </View>
          <View style={styles.overlayContent}>
            <CustomInput
              placeholder="Nombre Completo"
              value={formState.name}
              onChangeText={value => handleInputChange('name', value)}
            />
            <CustomInput
              placeholder="Correo Electrónico"
              value={formState.email}
              onChangeText={value => handleInputChange('email', value)}
            />
            <CustomInput
              placeholder="Nombre del Usuario"
              value={formState.username}
              onChangeText={value => handleInputChange('username', value)}
            />
            <CustomInput
              placeholder="Contraseña"
              secureTextEntry
              isSecure
              onChangeText={value => handleInputChange('password', value)}
            />
            <CustomInput
              placeholder="Confirmar Contraseña"
              secureTextEntry
              isSecure
              onChangeText={value =>
                handleInputChange('confirmPassword', value)
              }
            />
            <CustomButton title="Editar" onPress={handleUpdate} />
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
