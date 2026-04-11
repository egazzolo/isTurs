import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import CustomInput from '../../../../components/CustomInput/CustomInput';
import usePost from '../../../../hook/usePostFetch';
import Alert from '../../../../services/Alert';
import usePut from '../../../../hook/usePut';
import { useSelector } from 'react-redux';
import { selectUserRole } from '../../../../redux/slices/auth.slice';

export default function Pizarra({data,refreshData}: any) {
  const [texto, setTexto] = useState('');
  const [textoGuardado, setTextoGuardado] = useState('');
  const userRole = useSelector(selectUserRole);
  const {
    putData,
    isLoading,
    error: PostError,
  } = usePut({
    onSuccess: () => {
      Alert.success('Codigo enviado con exito');
      refreshData();
    },
    onError: error => console.error('Error:', error),
  });

  useEffect(() => {
    if (data.turistProgress && data.turistProgress.length > 0) {
      setTextoGuardado(data.turistProgress[0].chart);
    }
  }, [data.turistProgress]);

const handleSubmit = async () => {
  putData(`/translation/editTranslation`,{
    id_translation: data.turistProgress[0]._id,
    chart: texto,
  })
}

  const guardarTexto = () => {
    setTextoGuardado(texto);
  };
  return (
    <View style={styles.container}>
      <View style={styles.pizarra}>
        <Text style={styles.textoPizarra}>{textoGuardado}</Text>
        <View style={styles.cuerpoPizarra} />
      </View>
{
  userRole !== "TURIST" && (
<>
<CustomInput
        value={texto}
        onChangeText={setTexto}
        placeholder="Ingresar texto"
        placeholderTextColor="#00000089"
        containerStyle={styles.customInput}
      />

      <TouchableOpacity style={styles.botonGuardar} onPress={handleSubmit}>
        <Text style={styles.textoBoton}>Guardar</Text>
      </TouchableOpacity>
</>
  )
}
     
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pizarra: {
    width: '90%',
    height: 200,
    backgroundColor: 'white',
    opacity: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textoPizarra: {
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'black',
  },
  customInput: {
    marginTop: 80,
    paddingHorizontal: 10,
    width: '80%', // O el ancho que prefieras
  },
  botonGuardar: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
    width: '40%',
  },
  textoBoton: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',

  },
  cuerpoPizarra: {
    position: 'absolute',
    backgroundColor: 'white',
    height: 55,
    width: 18,
    bottom: -55,
  },
});
