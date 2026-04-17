import { View, Text, StyleSheet, ScrollView, TouchableOpacity, } from 'react-native';
import React, {useEffect, useState} from 'react';
import {sizeMargin} from '../../../../constants';
import CustomSelectBottomSheet from '../../../../components/CustomSelectBottomSheet/CustomSelectBottomSheet';
import {Box} from '../../../../components/Box';
import useGetFetch from '../../../../hook/useGetFetch';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomInput from '../../../../components/CustomInput/CustomInput';
import usePost from '../../../../hook/usePostFetch';
import Alert from '../../../../services/Alert';
import FullScreenLoader from '../../../../components/UI/FullScreenLoader';
import {useTranslation} from '../../../../i18n';

const initialState = {
  empresa: '',
  origen: '',
  destino: '',
  fecha: '',
  horaDisplay: '',
};

function convertTo24Hour(time:any) {
  if (!time) {
    // Si time es null, undefined o una cadena vacía, devolver lo que sea apropiado, por ejemplo '00:00'
    return '00:00';
  }
  
  const timeMatch = time.match(/(\d+):(\d+)(?:\s)?(AM|PM)/i);
  if (!timeMatch) {

    return time; // O devolver un valor predeterminado
  }

  let [hours, minutes] = timeMatch.slice(1, 3);
  if (time.includes('PM') && hours !== '12') {
    hours = parseInt(hours, 10) + 12;
  } else if (time.includes('AM') && hours === '12') {
    hours = '00';
  }
  return `${hours}:${minutes}`;
}


export default function AceptTurists({turista,setSelectedTurista,refreshData}: any) {
  console.log(turista);
  const {t} = useTranslation();
  const {data, error, loading} = useGetFetch('/user/getMyTransfers');
  const [formState, setFormState] = useState(initialState);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [timePickerVisible, setTimePickerVisible] = useState(false);

  const {
    postData,
    isLoading,
    error: PostError,
  } = usePost({
    onSuccess: () => {
      console.log('Operación exitosa');
      Alert.success(t.operationSuccess)
      setSelectedTurista(null);
      refreshData();
    },
    onError: error => console.error('Error:', error.response),
  });


  const OptionsTransladitas = (data as any)?.users?.map((item: any) => {
    return {
      id: item.uid,
      name: item.name,
    };
  });

  const handleInputChange = (name: string, value: string) => {
    setFormState({...formState, [name]: value});
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || new Date(formState.fecha);
    setDatePickerVisible(false);
    if (currentDate instanceof Date) {
      const day = `0${currentDate.getDate()}`.slice(-2);
      const month = `0${currentDate.getMonth() + 1}`.slice(-2);
      const year = currentDate.getFullYear();
      handleInputChange('fecha', `${day}/${month}/${year}`);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    const currentTime = selectedTime || new Date();
    setTimePickerVisible(false);
    if (currentTime instanceof Date) {
      const hours = currentTime.getHours();
      const minutes = currentTime.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = `0${minutes}`.slice(-2);

      handleInputChange(
        'horaDisplay',
        `${formattedHours}:${formattedMinutes} ${ampm}`,
      );
    }
  };

  // console.log(formState, 'formState');
  // console.log(turista, 'turista')

  const handleSubmit = () => {
    const payload = {
      turist_id: turista.turist_id,
      transfer_id: formState.empresa,
      id_translation: turista._id,
      origin: formState.origen,
      destination: formState.destino,
      date: formState.fecha,
      hour: formState.horaDisplay,
    };

    postData('/translation/acceptTourist', payload);
  }

  useEffect(() => {
    if (formState.horaDisplay) {
      const time24hr = convertTo24Hour(formState.horaDisplay);
      setFormState(prevState => ({ ...prevState, horaDisplay: time24hr }));
    }
  }, [formState.horaDisplay]);
  
  

  return (
    <ScrollView style={styles.overlayContent}>
      <View style={{flex: 1, gap: 8,paddingBottom:60}}>
        <Text style={styles.title}>{t.touristAcceptance}</Text>
        <View style={styles.turistDetails}>
          <Text style={styles.turistName}>{turista.turist_name}</Text>
        </View>

        <Box>
          <Text style={styles.textStyle}>{t.operatorHomeRole}:</Text>
          <CustomSelectBottomSheet
            textButton={formState.empresa || t.selectDriver2}
            loading={loading}
            items={OptionsTransladitas}
            onSelect={item => handleInputChange('empresa', item.id)}
          />
        </Box>
        <Box>
          <Text style={styles.textStyle}>{t.originPlace}</Text>
          <CustomInput
            placeholder={t.enterDestination}
            value={formState.origen}
            onChangeText={text => handleInputChange('origen', text)}
          />
        </Box>

        <Box>
          <Text style={styles.textStyle}>{t.destinationPlace}</Text>
          <CustomInput
            placeholder={t.enterOrigin}
            value={formState.destino}
            onChangeText={text => handleInputChange('destino', text)}
          />
        </Box>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Box width={'45%'}>
            <TouchableOpacity onPress={() => setDatePickerVisible(true)}>
              <Text style={styles.textStyle}>{t.date}:</Text>
              <Text style={styles.inputDisplay}>
                {formState.fecha || t.date}
              </Text>
            </TouchableOpacity>
            {datePickerVisible && (
              <DateTimePicker
                value={new Date()}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
          </Box>

          <Box width={'45%'}>
            <TouchableOpacity onPress={() => setTimePickerVisible(true)}>
              <Text style={styles.textStyle}>{t.time}:</Text>
              <Text style={styles.inputDisplay}>
                {formState.horaDisplay || t.time}
              </Text>
            </TouchableOpacity>
            {timePickerVisible && (
              <DateTimePicker
                value={new Date()}
                mode="time"
                display="default"
                onChange={handleTimeChange}
                is24Hour={false}
              />
            )}
          </Box>
        </View>
      <TouchableOpacity
        style={[styles.btn]}
        onPress={() => handleSubmit()}
        // disabled={isStartDisabled}
      >
        <Text style={styles.btnText}>{t.start}</Text>
      </TouchableOpacity>
      </View>
      <FullScreenLoader visible={isLoading}/>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  overlayContent: {
    flex: 1,
    paddingHorizontal: sizeMargin['spacing-xxs'],
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    paddingHorizontal: sizeMargin['spacing-xxxs'],
    color: 'black',
  },
  turistDetails: {
    padding: sizeMargin['spacing-xxs'],
    backgroundColor: 'white',
    borderRadius: 10,
    marginVertical: sizeMargin['spacing-xxs'],
  },
  turistName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#767676',
  },
  textStyle: {
    color: 'black',
    fontSize: 15,
    marginTop: 5,
  },
  inputDisplay: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12.5,
    borderWidth: 1,
    borderColor: 'rgba(28, 26, 26, 0.4)',
    color: '#666',
    backgroundColor: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  btn: {
    backgroundColor: '#0373f3',
    padding: 15,
    borderRadius: 50,
  },
  disabledBtn: {
    backgroundColor: '#CCCCCC', // un gris para indicar que el botón está deshabilitado
  },
  btnText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
