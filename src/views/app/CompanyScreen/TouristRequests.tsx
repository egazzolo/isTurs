import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/Feather';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {HomeCompanyStackParamList} from '../../../navigation/types';
import {selectUser, selectUserProfile} from '../../../redux/slices/auth.slice';
import {Asset} from 'react-native-image-picker';
import AppImages from '../../../assets/icon';
import {Background} from '../../../components/Background/Background';
import ImagePicker from '../../../components/ImagePicker/ImagePicker';
import ButtonOpacity from '../../../components/ButtonOpacity/ButtonOpacity';
import {sizeMargin} from '../../../constants';
import {Colors} from '../../../theme';
import useGetFetch from '../../../hook/useGetFetch';
import {Empty} from './HomeCompanyScreen';
import {formatDate} from '../../../utils/FormatDate';
import AceptTurists from './components/AceptTurists';
import {useTranslation} from '../../../i18n';

type HomeScreenProps = NativeStackScreenProps<
  HomeCompanyStackParamList,
  'TouristRequestsScreen'
>;

export interface TuristPending {
  _id: string;
  state: string;
  chart: string;
  code: string;
  create_at: Date;
  __v: number;
}

const TouristRequests: React.FC<HomeScreenProps> = ({navigation}) => {
  const {t} = useTranslation();
  const user = useSelector(selectUserProfile);
  const {data: dataTurist, loading, refreshData} = useGetFetch<Empty>('translation/getMyRequest');
  const userData = useSelector(selectUser);
  const [selectedTurista, setSelectedTurista] = useState<TuristPending | null>(null);

  const handleIconClick = (turista: TuristPending) => setSelectedTurista(turista);

  const handleImageSelected = (image: Asset) => console.log(image.uri);

  const renderTrasladoItem = ({item}: {item: TuristPending}) => (
    <View style={styles.trasladoItem}>
      <Image
        source={require('../../../assets/images/coloseum.png')}
        style={styles.image}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{item.chart}</Text>
        <Text style={styles.empresa}>
          {formatDate(item.create_at)} -{' '}
          {item.state === 'PENDING' ? t.pending : t.accepted}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => handleIconClick(item)}
        style={styles.iconContainer}>
        <Icon name="send" size={20} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Background xml={AppImages.BACKGROUND} darkOverlay />
      <View style={styles.overlayContent}>
        <Text style={styles.titleText}>{t.welcome}</Text>
        <View style={styles.headerContainer}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
            <ImagePicker
              onImageSelected={handleImageSelected}
              initialImageUri={`${user}`}
            />
            <View>
              <Text style={styles.titleName}>{userData?.name}</Text>
              <Text style={styles.subtitleUserRole}>
                {userData?.role === 'COMPANY' ? t.company : ''}
              </Text>
            </View>
          </View>
          <ButtonOpacity style={styles.btnEditProfile} textStyle={styles.textBtn}>
            {t.editProfile}
          </ButtonOpacity>
        </View>
      </View>

      <View style={styles.contentContainer}>
        {selectedTurista ? (
          <AceptTurists
            turista={selectedTurista}
            setSelectedTurista={setSelectedTurista}
            refreshData={refreshData}
          />
        ) : (
          <>
            <Text style={styles.sectionHeader}>{t.touristRequests}</Text>
            <FlatList
              data={dataTurist?.turistPending}
              renderItem={renderTrasladoItem}
              keyExtractor={item => item._id}
              style={styles.flatList}
            />
          </>
        )}
      </View>
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
    paddingHorizontal: sizeMargin['spacing-xxxxs'],
  },
  overlayContent: {
    paddingVertical: sizeMargin['spacing-m'],
    paddingHorizontal: sizeMargin['spacing-xxs'],
  },
  btnEditProfile: {
    paddingVertical: 7,
    paddingHorizontal: 15,
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
    backgroundColor: '#F8F8F8',
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
  image: {width: 50, height: 50, borderRadius: 10},
  infoContainer: {flex: 1, marginLeft: 10},
  title: {fontWeight: 'bold', color: '#767676'},
  empresa: {color: 'grey'},
  flatList: {flex: 1},
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
  subtitleUserRole: {fontWeight: '400', fontSize: 16, color: '#b0b1b4'},
});

export default TouristRequests;
