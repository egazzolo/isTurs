import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  selectUser,
  selectUserProfile,
  selectUserRole,
  setSignOut,
} from '../../../redux/slices/auth.slice';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {HomeStackParamList} from '../../../navigation/types';
import {Background} from '../../../components/Background/Background';
import AppImages from '../../../assets/icon';
import ImagePicker from '../../../components/ImagePicker/ImagePicker';
import {Asset} from 'react-native-image-picker';
import {sizeMargin} from '../../../constants';
import {SIZES_MEDIUM} from '../../../constants/fonts';
import ButtonOpacity from '../../../components/ButtonOpacity/ButtonOpacity';
import {Colors} from '../../../theme';
import Icon from 'react-native-vector-icons/Feather';
import NewTranslate from './components/NewTranslate';
import useGetFetch from '../../../hook/useGetFetch';
import {formatSpanishDate} from '../../../utils/FormatSpanishDate';
import Icons from 'react-native-vector-icons/Ionicons';
import FullScreenLoader from '../../../components/UI/FullScreenLoader';
import {useTranslation} from '../../../i18n';

type HomeScreenProps = NativeStackScreenProps<HomeStackParamList, 'HomeScreen'>;

export interface Translado {
  translations: Translation[];
  count: number;
}

export interface Translation {
  _id: string;
  state: string;
  chart: string;
  code: string;
  create_at: Date;
  turist_name: string;
  __v: number;
  date: string;
  destination: string;
  origin: string;
  transfer_id: string;
  image: any;
  enCurso: boolean;
  empresa: string;
  id: string;
  turist_IMG: string;
  hour: string;
}

const Home: React.FC<HomeScreenProps> = ({navigation}) => {
  const {t} = useTranslation();
  const user = useSelector(selectUserProfile);
  const [currentView, setCurrentView] = useState<'home' | 'newTraslado'>('home');
  const userData = useSelector(selectUser);
  const userRole = useSelector(selectUserRole);
  const [trasladosData, setTrasladosData] = useState<Translation[]>([]);
  const dispatch = useDispatch();

  const logout = () => dispatch(setSignOut());

  const {data, loading, error, refreshData} = useGetFetch<Translado[]>('/translation/myTranslations');

  useEffect(() => {
    if (!loading && data && (data as any).translations) {
      setTrasladosData((data as any).translations);
    }
  }, [data, loading]);

  useEffect(() => {
    refreshData();
  }, []);

  const hasActiveTraslado = trasladosData.some(item => item.enCurso);
  const hasData = trasladosData.length > 0;

  const handleNavigation = (itemId: string) => {
    navigation.navigate('DetailsTranslado', {id: itemId, refreshData});
  };

  const handleImageSelected = (image: Asset) => {
    console.log(image.uri);
  };

  const renderTrasladoItem = ({item}: {item: Translation}) => (
    <View style={item.enCurso ? styles.activeTrasladoItem : styles.trasladoItem}>
      <Image
        source={{uri: item.turist_IMG}}
        style={item.enCurso ? styles.activeImage : styles.image}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.title}>
          {item.origin} - {item.destination}
        </Text>
        <Text style={styles.empresa}>
          {formatSpanishDate(item.date)} - {item.hour}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => handleNavigation(item._id)}>
        <Icon name="send" size={item.enCurso ? 25 : 20} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Background xml={AppImages.BACKGROUND} darkOverlay />
      <Icons
        onPress={logout}
        name="exit"
        size={30}
        color={'white'}
        style={{position: 'absolute', top: 10, right: 10}}
      />
      <View style={styles.overlayContent}>
        <Text style={styles.titleText}>{t.welcome}</Text>
        <View style={styles.headerContainer}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
            <ImagePicker
              onImageSelected={handleImageSelected}
              initialImageUri={`${user}`}
            />
            <View>
              <Text style={styles.titleName}>
                {userData ? userData.name : ''}
              </Text>
              <Text style={styles.subtitleUserRole}>
                {userData && userData.role === 'TURIST'
                  ? t.tourist
                  : userData && userData.role === 'OPERATOR'
                  ? t.operator
                  : ''}
              </Text>
            </View>
          </View>
          <ButtonOpacity
            style={styles.btnEditProfile}
            textStyle={styles.textBtn}
            onPress={() => navigation.navigate('EditProfileScreen')}>
            {t.editProfile}
          </ButtonOpacity>
        </View>
      </View>

      {currentView === 'home' && (
        <View style={styles.contentContainer}>
          {hasData ? (
            <>
              {hasActiveTraslado && (
                <>
                  <Text style={styles.sectionHeader}>{t.activeTransfer}</Text>
                  {trasladosData
                    .filter(item => item.enCurso)
                    .map(item => renderTrasladoItem({item}))}
                </>
              )}
              <Text style={styles.sectionHeader}>{t.recentTransfers}</Text>
              <FlatList
                data={trasladosData.filter(item => !item.enCurso)}
                renderItem={renderTrasladoItem}
                keyExtractor={item => item._id}
                style={styles.flatList}
              />
            </>
          ) : (
            <Text style={{textAlign: 'center', marginTop: 20, fontSize: 18, color: 'black'}}>
              {t.noTransfers}
            </Text>
          )}
          {userRole === 'TURIST' && (
            <View style={{backgroundColor: 'white', height: 70, marginTop: 10}}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => setCurrentView('newTraslado')}>
                <Text style={styles.buttonText}>{t.startNewTransfer}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
      {currentView === 'newTraslado' && (
        <NewTranslate setCurrentView={setCurrentView} />
      )}
      <FullScreenLoader visible={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, position: 'relative'},
  titleText: {fontSize: 25, fontWeight: 'bold', color: 'white'},
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: sizeMargin['spacing-xs'],
    paddingHorizontal: sizeMargin['spacing-xxxs'],
  },
  overlayContent: {
    paddingVertical: sizeMargin['spacing-m'],
    paddingHorizontal: sizeMargin['spacing-xxs'],
  },
  btnEditProfile: {
    paddingVertical: 7,
    paddingHorizontal: 25,
    backgroundColor: Colors.primary,
    borderRadius: 15,
  },
  textBtn: {color: 'white', fontSize: 15, fontWeight: '600'},
  contentContainer: {
    paddingHorizontal: sizeMargin['spacing-xxxs'],
    paddingVertical: sizeMargin['spacing-xxs'],
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
  },
  trasladoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginHorizontal: 10,
    marginTop: 10,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    margin: 5,
  },
  image: {width: 50, height: 50, borderRadius: 50},
  activeImage: {width: 70, height: 70, borderRadius: 70},
  infoContainer: {flex: 1, marginLeft: 10},
  title: {fontWeight: 'bold', color: '#767676'},
  empresa: {color: 'grey'},
  button: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginHorizontal: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  buttonText: {color: 'white', fontSize: 18, fontWeight: 'bold'},
  flatList: {flex: 1},
  activeTrasladoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: sizeMargin['spacing-xxxs'],
    marginHorizontal: sizeMargin['spacing-xxxs'],
    marginVertical: 15,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  sectionHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    paddingHorizontal: sizeMargin['spacing-xxxs'],
    color: 'black',
  },
  iconContainer: {
    backgroundColor: '#0373f3',
    paddingVertical: 10,
    paddingHorizontal: 9,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
  titleName: {fontWeight: '600', fontSize: 20, color: 'white'},
  subtitleUserRole: {fontWeight: '400', fontSize: 16, color: '#bbbcc1'},
});

export default Home;
