import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Pizarra from './components/Pizarra';
import ProfileIMG from './components/ProfileIMG';
import Chat from './components/Chat';
import {Background} from '../../../components/Background/Background';
import AppImages from '../../../assets/icon';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {HomeStackParamList} from '../../../navigation/types';
import {sizeMargin} from '../../../constants';
import useGetFetch from '../../../hook/useGetFetch';
import FullScreenLoader from '../../../components/UI/FullScreenLoader';
import {selectUserRole} from '../../../redux/slices/auth.slice';
import {useSelector} from 'react-redux';
import usePost from '../../../hook/usePostFetch';
import Alert from '../../../services/Alert';
import Icon from 'react-native-vector-icons/Feather';
import CustomModal from '../../../components/CustomModal/CustomModal';
import {useTranslation} from '../../../i18n';

type HomeScreenProps = NativeStackScreenProps<
  HomeStackParamList,
  'DetailsTranslado'
>;

interface TuristProgressMain {
  turistProgress: TuristProgress[];
}

export interface TuristProgress {
  _id: string;
  state: string;
  chart: string;
  turist_IMG: string;
  code: string;
  create_at: Date;
  turist_name: string;
  turist_id: string;
  __v: number;
  chat_Id: string;
  date: string;
  destination: string;
  origin: string;
  transfer_id: string;
}

const DetailsTranslator: React.FC<HomeScreenProps> = ({navigation, route}) => {
  const {id, refreshData} = route.params;
  const {t} = useTranslation();
  const role = useSelector(selectUserRole);
  const [activeTab, setActiveTab] = useState('pizarra');
  const [modalVisible, setModalVisible] = useState(false);

  const {data, error, loading} = useGetFetch<TuristProgressMain>(
    `/translation/getMyTranslate/${id}`,
  );

  const {postData} = usePost({
    onSuccess: () => {
      Alert.success(t.finishSuccess);
      refreshData();
      navigation.goBack();
    },
    onError: error => {
      Alert.warning(t.finishError);
      console.log(error.response);
    },
  });

  const handleFinishTranslado = () => {
    postData('/translation/finishTranslate', {
      id_translation: data?.turistProgress[0]._id,
    });
  };

  const getButtonStyle = (tabName: string) =>
    tabName === activeTab ? [styles.btnPress, styles.activeTab] : styles.btnPress;

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: `${data?.turistProgress[0].origin} - ${data?.turistProgress[0].destination}`,
      headerTitleAlign: 'center',
      headerRight: () =>
        role === 'OPERATOR' ? (
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Icon name="check" size={30} color={'#000000'} />
          </TouchableOpacity>
        ) : null,
    });
  }, [data]);

  const renderActiveTab = () => {
    if (!data) return null;
    switch (activeTab) {
      case 'pizarra':
        return <Pizarra data={data} refreshData={refreshData} />;
      case 'foto':
        return <ProfileIMG data={data} />;
      case 'chat':
        return <Chat data={data} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Background xml={AppImages.BACKGROUND} darkOverlay />

      <CustomModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}>
        <Text style={styles.modalText}>{t.confirmFinishTransfer}</Text>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingHorizontal: 20}}>
          <TouchableOpacity
            style={styles.modalBtn}
            onPress={() => {
              handleFinishTranslado();
              setModalVisible(false);
            }}>
            <Text style={styles.modalBtnText}>{t.yes}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalBtn}
            onPress={() => setModalVisible(false)}>
            <Text style={styles.modalBtnText}>{t.no}</Text>
          </TouchableOpacity>
        </View>
      </CustomModal>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          onPress={() => setActiveTab('pizarra')}
          style={getButtonStyle('pizarra')}>
          <Text style={['pizarra' === activeTab ? styles.activeText : styles.tabButton]}>
            {t.board}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('foto')}
          style={getButtonStyle('foto')}>
          <Text style={['foto' === activeTab ? styles.activeText : styles.tabButton]}>
            {t.photo}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('chat')}
          style={getButtonStyle('chat')}>
          <Text style={['chat' === activeTab ? styles.activeText : styles.tabButton]}>
            {t.chat}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}
        style={{flex: 1}}>
        <View style={styles.viewContainer}>{renderActiveTab()}</View>
      </ScrollView>
      <FullScreenLoader visible={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    paddingVertical: 20,
    backgroundColor: '#F8F8F8',
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
  },
  btnPress: {
    backgroundColor: '#ffffff',
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#C3C3C3',
    borderRadius: 35,
    width: 100,
  },
  tabButton: {color: 'black', textAlign: 'center'},
  viewContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: sizeMargin['spacing-xxs'],
    paddingHorizontal: sizeMargin['spacing-xxs'],
  },
  activeTab: {backgroundColor: '#0373F3', borderColor: '#007AFF'},
  activeText: {color: '#ffffff', textAlign: 'center'},
  modalText: {marginBottom: 15, textAlign: 'center'},
  modalBtn: {
    backgroundColor: '#0373F3',
    padding: 10,
    borderRadius: 10,
    width: '40%',
  },
  modalBtnText: {color: '#ffffff', textAlign: 'center', fontSize: 16},
});

export default DetailsTranslator;
