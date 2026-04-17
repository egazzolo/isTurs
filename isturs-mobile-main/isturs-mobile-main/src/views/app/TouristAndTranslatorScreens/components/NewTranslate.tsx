import { View, Text, StyleSheet, TouchableOpacity, ScrollView, } from 'react-native';
import React, {useEffect, useState} from 'react';
import {sizeMargin} from '../../../../constants';
import CustomInput from '../../../../components/CustomInput/CustomInput';
import CustomSelectBottomSheet from '../../../../components/CustomSelectBottomSheet/CustomSelectBottomSheet';
import {Box} from '../../../../components/Box';
import useGetFetch from '../../../../hook/useGetFetch';
import {err} from 'react-native-svg';
import {useSelector} from 'react-redux';
import {selectToken} from '../../../../redux/slices/auth.slice';
import FullScreenLoader from '../../../../components/UI/FullScreenLoader';
import usePost from '../../../../hook/usePostFetch';
import Alert from '../../../../services/Alert';
import {useTranslation} from '../../../../i18n';

interface Company {
  code: string;
  name: string;
  type_company: string;
  uid: string;
}

interface CompanyOption {
  label: string;
  value: string;
  id?: string;
}

const initialState: Company[] = [];

interface NewTranslateProps {
  setCurrentView: (view: string) => void;
}

const options = [
  {id: '1', name: 'Juridica'},
  {id: '2', name: 'Natural'},
];

export default function NewTranslate({setCurrentView}: any) {
  const {t} = useTranslation();
  const [typeCompany, setTypeCompany] = useState('');
  const {data, loading, error} = useGetFetch(
    `/translation/getCompanies/${typeCompany}`,
  );
  const [companies, setCompanies] = useState<CompanyOption[]>([]);
  const [inputCode, setInputCode] = useState('');
  const [fetchByCode, setFetchByCode] = useState(false);
  const [companyTypeButtonText, setCompanyTypeButtonText] =
    useState(t.companyType);
  const [companyButtonText, setCompanyButtonText] = useState(
    (t.selectCompany),
  );

  const [codeDataSucces, setCodeDataSucces] = useState(false);
  const [companySelected, setCompanySelected] = useState<CompanyOption | null>(
    null,
  );

  const userByCode = useGetFetch(
    fetchByCode ? `/user/getByCode/${inputCode}` : '',
  );

  const {
    postData,
    isLoading,
    error: PostError,
  } = usePost({
    onSuccess: () => {
      console.log('Operación exitosa');
      Alert.success(t.codeSentSuccess);
      setInputCode('');
      setCompanySelected(null);
      setCurrentView('home');
    },
    onError: error => console.error('Error:', error),
  });

  console.log(PostError, 'PostError');

  const handleStart = () => {
    // Decide qué código enviar
    const codeToSend =
      inputCode.trim() !== '' ? inputCode.trim() : companySelected?.id;

    // Si hay algo que enviar, usa el hook postData
    if (codeToSend && !isLoading) {
      postData('/translation/postTranslation', {code: codeToSend});
    }
  };

  const handleSendCode = () => {
    if (inputCode.trim() !== '') {
      setFetchByCode(true);
    }
  };

  const isStartDisabled = isLoading || (!inputCode.trim() && !companySelected);

  useEffect(() => {
    if (data && (data as any).companies) {
      const companyOptions: CompanyOption[] = (data as any).companies.map(
        (company: Company) => ({
          name: company.name,
          id: company.code,
        }),
      );
      setCompanies(companyOptions);
    }

    if (
      fetchByCode &&
      userByCode.data &&
      (userByCode.data as any).users.length > 0
    ) {
      const user = (userByCode.data as any).users[0];
      setCodeDataSucces(true);
      setCompanies([{label: user.name, value: user.code}]);
      setCompanyButtonText(user.name);
      setCompanyTypeButtonText(user.type_company);
      setFetchByCode(false); // Evita refetching
    }
  }, [data, userByCode.data, fetchByCode]);



  return (
    <ScrollView
      style={styles.contentContainer}
      contentContainerStyle={{
        flexGrow: 1,

        gap: 20,
      }}>
      <Box>
        <Text style={styles.textStyle}>{t.enterCode}</Text>
        <CustomInput
          disabled={companySelected !== null}
          placeholder={t.code}
          value={inputCode}
          onChangeText={setInputCode} // Asegúrate de que CustomInput maneje onChangeText
        />
      </Box>
      <TouchableOpacity style={styles.btn} onPress={handleSendCode}>
        <Text style={styles.btnText}>{t.search}</Text>
      </TouchableOpacity>

      <Box>
        <Text style={styles.textStyle}>{t.companyType}</Text>
        <CustomSelectBottomSheet
          textButton={companyTypeButtonText}
          items={options}
          disabled={codeDataSucces}
          onSelect={value => {
            setTypeCompany(value.name);
          }}
        />
      </Box>

      <Box>
        <Text style={styles.textStyle}>{t.company}</Text>
        <CustomSelectBottomSheet
          id="company"
          textButton={companyButtonText} // Usa el estado para el texto del botón
          items={companies}
          loading={loading}
          disabled={codeDataSucces}
          onSelect={value => {
            setCompanySelected(value);
            // Aquí deberías también actualizar el texto del botón si seleccionas una nueva empresa
            const selectedCompany = companies.find(c => c.value === value);
            if (selectedCompany) {
              setCompanyButtonText(selectedCompany.label);
            }
          }}
        />
      </Box>

      <TouchableOpacity
        style={[styles.btn, isStartDisabled && styles.disabledBtn]}
        onPress={handleStart}
        disabled={isStartDisabled}>
        <Text style={styles.btnText}>{t.start}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btnCancel}
        onPress={() => setCurrentView('home')}>
        <Text style={styles.btnText}>{t.cancel}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: sizeMargin['spacing-m'],
    paddingVertical: sizeMargin['spacing-s'],
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#f8f8f8',
    height: '68%',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    gap: 20,
  },
  textStyle: {
    color: 'black',
    fontSize: 15,
    marginBottom: 5,
  },
  btn: {
    backgroundColor: '#0373f3',
    padding: 15,
    borderRadius: 50,
  },
  disabledBtn: {
    backgroundColor: '#CCCCCC', // un gris para indicar que el botón está deshabilitado
  },
  btnCancel: {
    backgroundColor: '#f30303d8',
    padding: 10,
    borderRadius: 50,
    marginBottom: 50,
  },
  btnText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
