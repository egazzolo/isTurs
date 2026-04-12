import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {HomeCompanyStackParamList} from '../../../navigation/types';
import {selectUserProfile} from '../../../redux/slices/auth.slice';
import {Asset} from 'react-native-image-picker';
import AppImages from '../../../assets/icon';
import {Background} from '../../../components/Background/Background';
import ImagePicker from '../../../components/ImagePicker/ImagePicker';
import ButtonOpacity from '../../../components/ButtonOpacity/ButtonOpacity';
import {sizeMargin} from '../../../constants';
import {Colors} from '../../../theme';
import useGetFetch from '../../../hook/useGetFetch';
import {useTranslation} from '../../../i18n';

type HomeScreenProps = NativeStackScreenProps<
  HomeCompanyStackParamList,
  'TouristsInProgress'
>;

export interface EmptyTuristProgress {
  turistProgress: TuristProgress[];
  count: number;
}

export interface TuristProgress {
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
  turist_id?: string;
  turist_IMG: string;
}

const TouristsInProgressScreen: React.FC<HomeScreenProps> = ({navigation}) => {
  const {t} = useTranslation();
  const user = useSelector(selectUserProfile);
  const {data: ProccesTurist} = useGetFetch<EmptyTuristProgress>(
    'translation/getMyTuristProcess',
  );

  const handleImageSelected = (image: Asset) => console.log(image.uri);

  const renderTrasladoItem = ({item}: {item: TuristProgress}) => (
    <View style={styles.trasladoItem}>
      <Image source={{uri: item.turist_IMG}} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{item.turist_name}</Text>
        <Text style={styles.empresa}>
          {item.code} - {item.date}
        </Text>
      </View>
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
              <Text style={styles.titleName}>Compañia A</Text>
              <Text style={styles.subtitleUserRole}>{t.company}</Text>
            </View>
          </View>
          <ButtonOpacity style={styles.btnEditProfile} textStyle={styles.textBtn}>
            {t.editProfile}
          </ButtonOpacity>
        </View>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.sectionHeader}>{t.touristsInProgress}</Text>
        <FlatList
          data={ProccesTurist?.turistProgress || []}
          renderItem={renderTrasladoItem}
          keyExtractor={item => item._id}
          style={styles.flatList}
        />
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
    paddingBottom: sizeMargin['spacing-l'],
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
  titleName: {fontWeight: '600', fontSize: 20, color: 'white'},
  subtitleUserRole: {fontWeight: '400', fontSize: 16, color: '#424762'},
});

export default TouristsInProgressScreen;
