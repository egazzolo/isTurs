import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
} from 'react-native';
import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/Feather';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {HomeCompanyStackParamList} from '../../../navigation/types';
import {
  selectUser,
  selectUserProfile,
  setSignOut,
} from '../../../redux/slices/auth.slice';
import {Asset} from 'react-native-image-picker';
import AppImages from '../../../assets/icon';
import {Background} from '../../../components/Background/Background';
import ImagePicker from '../../../components/ImagePicker/ImagePicker';
import ButtonOpacity from '../../../components/ButtonOpacity/ButtonOpacity';
import {sizeMargin} from '../../../constants';
import {Colors} from '../../../theme';
import {RenderSvgXML} from '../../../components/RenderSvgXML/index';
import {SIZES} from '../../../constants/fonts';
import useGetFetch from '../../../hook/useGetFetch';
import Icons from 'react-native-vector-icons/Ionicons';
import {useTranslation} from '../../../i18n';

type HomeCompany = NativeStackScreenProps<
  HomeCompanyStackParamList,
  'HomeScreenCompany'
>;

export interface Empty {
  count: number;
  turistPending: TuristPending[];
}

export interface TuristPending {
  __v: number;
  _id: string;
  chart: string;
  code: string;
  create_at: Date;
  state: string;
  turist_name: string;
}

export interface EmptyTransladista {
  users: User[];
  count: number;
}

export interface User {
  name: string;
  email: string;
  username: string;
  code: string;
  type_company: string;
  company: string;
  role: string;
  uid: string;
  profile_img: string;
}

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
}

const HomeCompanyScreen: React.FC<HomeCompany> = ({navigation}) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const {data, loading, refreshData} = useGetFetch<Empty>('translation/getMyRequest');
  const {
    data: TransladistData,
    refreshData: refreshDataTransladist,
  } = useGetFetch<EmptyTransladista>('user/getMyTransfers');
  const {
    data: ProccesTurist,
    refreshData: refreshDataProccesTurist,
  } = useGetFetch<EmptyTuristProgress>('translation/getMyTuristProcess');

  const user = useSelector(selectUserProfile);
  const userData = useSelector(selectUser);

  const logout = () => dispatch(setSignOut());

  const handleImageSelected = (image: Asset) => {
    console.log(image.base64);
  };

  useEffect(() => {
    refreshData();
    refreshDataTransladist();
    refreshDataProccesTurist();
  }, []);

  return (
    <>
      <ScrollView contentContainerStyle={{flex: 1}}>
        <Icons
          onPress={logout}
          name="exit"
          size={30}
          color={'white'}
          style={{position: 'absolute', top: 10, right: 10, zIndex: 100}}
        />
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
              <ButtonOpacity
                onPress={() => navigation.navigate('EditProfileCompanyScreen')}
                style={styles.btnEditProfile}
                textStyle={styles.textBtn}>
                {t.editProfile}
              </ButtonOpacity>
            </View>
          </View>

          <ScrollView
            style={styles.contentContainerElement}
            contentContainerStyle={{gap: 20, paddingBottom: sizeMargin['spacing-m']}}>
            <View style={styles.InfoCompany}>
              <View style={styles.infoCompanyIconContainer}>
                <RenderSvgXML
                  xml={AppImages.icons.companyVector}
                  width={20}
                  height={20}
                />
              </View>
              <View style={styles.infoCompanyData}>
                <Text style={styles.titleInfo}>{userData?.name}</Text>
                <Text style={styles.dataText}>{t.codeLabel} {userData?.code}</Text>
                <Text style={styles.dataText}>{t.commercialNameLabel}</Text>
                <Text style={styles.dataText}>{t.phoneLabel}</Text>
                <Text style={styles.dataText}>
                  {t.companyTypeInfoLabel} {userData?.type_company}
                </Text>
              </View>
            </View>

            <View style={{...styles.InfoCompany, alignItems: 'center', justifyContent: 'space-around'}}>
              <View style={styles.CountDetails}>
                <View style={styles.DetailsIcon}>
                  <RenderSvgXML xml={AppImages.icons.Group_Icon} width={20} height={20} />
                </View>
                <Text style={styles.count}>{TransladistData?.count}</Text>
                <Text style={styles.dataText}>{t.drivers}</Text>
              </View>
              <View style={styles.CountDetails}>
                <View style={styles.DetailsIcon}>
                  <RenderSvgXML xml={AppImages.icons.Group_Icon} width={20} height={20} />
                </View>
                <Text style={styles.count}>{ProccesTurist?.count}</Text>
                <Text style={styles.dataText}>{t.tourists}</Text>
              </View>
              <View style={styles.CountDetails}>
                <View style={styles.DetailsIcon}>
                  <RenderSvgXML xml={AppImages.icons.User_Icon} width={20} height={20} />
                </View>
                <Text style={styles.count}>{data?.count}</Text>
                <Text style={styles.dataText}>{t.requests}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('TouristsInProgress')}>
              <Text style={styles.buttonText}>{t.touristsInProgress}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('ListOfTransferorsScreen')}>
              <Text style={styles.buttonText}>{t.listOfDrivers}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('TouristRequestsScreen')}>
              <Text style={styles.buttonText}>{t.touristRequests}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, position: 'relative', gap: 20},
  contentContainerElement: {
    flex: 1,
    paddingVertical: sizeMargin['spacing-s'],
    marginHorizontal: sizeMargin['spacing-xxs'],
    marginBottom: sizeMargin['spacing-l'],
  },
  titleText: {fontSize: 25, fontWeight: 'bold', color: 'white'},
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: sizeMargin['spacing-xs'],
    paddingHorizontal: sizeMargin['spacing-xxxs'],
  },
  overlayContent: {
    paddingTop: sizeMargin['spacing-s'],
    paddingHorizontal: sizeMargin['spacing-xxs'],
  },
  btnEditProfile: {
    paddingVertical: 7,
    paddingHorizontal: 15,
    backgroundColor: Colors.primary,
    borderRadius: 15,
  },
  textBtn: {color: 'white', fontSize: 15, fontWeight: '600'},
  button: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 125,
    alignItems: 'center',
  },
  buttonText: {color: 'white', fontSize: 18, fontWeight: 'bold'},
  InfoCompany: {
    backgroundColor: '#f8f8f8',
    padding: sizeMargin['spacing-xxs'],
    height: 150,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 20,
  },
  infoCompanyIconContainer: {
    width: 45,
    height: 45,
    backgroundColor: '#d7e5f3',
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoCompanyData: {},
  titleInfo: {color: 'black', fontSize: SIZES.XXMEDIUM, fontWeight: 'bold'},
  dataText: {color: '#888888', fontSize: SIZES.MEDIUM, fontWeight: '500'},
  count: {color: 'black', fontSize: 16, fontWeight: 'bold'},
  CountDetails: {justifyContent: 'space-around', alignItems: 'center'},
  DetailsIcon: {
    width: 45,
    height: 45,
    backgroundColor: '#d7e5f3',
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#3399FF',
    borderWidth: 1,
  },
  titleName: {fontWeight: '600', fontSize: 20, color: 'white'},
  subtitleUserRole: {fontWeight: '400', fontSize: 16, color: '#b0b1b4'},
});

export default HomeCompanyScreen;
