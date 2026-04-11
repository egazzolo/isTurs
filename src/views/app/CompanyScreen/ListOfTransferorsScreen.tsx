import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
} from 'react-native';
import React from 'react';
import {useDispatch, useSelector} from 'react-redux';

import Icon from 'react-native-vector-icons/Feather';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  HomeCompanyStackParamList,
  HomeStackParamList,
} from '../../../navigation/types';
import {selectUserProfile, setSignOut} from '../../../redux/slices/auth.slice';
import {Asset} from 'react-native-image-picker';
import AppImages from '../../../assets/icon';
import {Background} from '../../../components/Background/Background';
import ImagePicker from '../../../components/ImagePicker/ImagePicker';
import ButtonOpacity from '../../../components/ButtonOpacity/ButtonOpacity';
import {sizeMargin} from '../../../constants';
import {Colors} from '../../../theme';
import {EmptyTransladista, User} from './HomeCompanyScreen';
import useGetFetch from '../../../hook/useGetFetch';
import {formatDate} from '../../../utils/FormatDate';

type HomeScreenProps = NativeStackScreenProps<
  HomeCompanyStackParamList,
  'ListOfTransferorsScreen'
>;

type Traslado = {
  id: string;
  title: string;
  empresa: string;
  date: string;
  image: any;
  enCurso: boolean;
  profile_img: string;
};



const ListOfTransferorsScreen: React.FC<HomeScreenProps> = ({navigation}) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUserProfile);
  const {
    data: TransladistData,
    loading: TransladistLoading,
    error: TransladistError,
  } = useGetFetch<EmptyTransladista>(`user/getMyTransfers`);

  console.log(TransladistData)

  const handleImageSelected = (image: Asset) => {
    console.log(image.uri);
  };

  const renderTrasladoItem = ({item}: {item: User}) => {
    console.log(item)
    return (
      <View style={styles.trasladoItem}>
        <Image
          source={{uri: item.profile_img}}
          style={styles.image}
        />
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.empresa}>
            {item.role === 'OPERATOR' ? 'Trasladista' : ''}
          </Text>
          <Text>{item.email}</Text>
        </View>
        {/* <View style={styles.iconContainer}>
          <Icon name="send" size={20} color="#ffffff" />
        </View> */}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Background xml={AppImages.BACKGROUND} darkOverlay />

      <View style={styles.overlayContent}>
        <Text style={styles.titleText}>Bienvenido</Text>

        <View style={styles.headerContainer}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
            <ImagePicker
              onImageSelected={handleImageSelected}
              initialImageUri={`${user}`}
            />
            <View>
              <Text style={styles.titleName}>Compañia A</Text>
              <Text style={styles.subtitleUserRole}>Empresa</Text>
            </View>
          </View>
          <ButtonOpacity
            style={styles.btnEditProfile}
            textStyle={styles.textBtn}
            // onPress={() => navigation.navigate('')}
          >
            Editar Perfil
          </ButtonOpacity>
        </View>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.sectionHeader}>Lista de Trasladistas</Text>

        <FlatList
          data={TransladistData?.users}
          renderItem={renderTrasladoItem}
          keyExtractor={item => item.uid}
          style={styles.flatList}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  titleText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'white',
  },
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
    paddingBottom: sizeMargin['spacing-l'],
  },
  btnEditProfile: {
    paddingVertical: 7,
    paddingHorizontal: 15,
    backgroundColor: Colors.primary,
    borderRadius: 15,
  },
  textBtn: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
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
  image: {
    width: 50, // smaller image for trasladoItem
    height: 50,
    borderRadius: 50,
  },
  activeImage: {
    width: 70, // larger image for activeTrasladoItem
    height: 70,
    borderRadius: 10,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontWeight: 'bold',
    color: '#767676',
  },
  empresa: {
    color: 'grey',
  },

  button: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },

  flatList: {
    flex: 1,
  },
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
  titleName: {
    fontWeight: '600',
    fontSize: 20,
    color: 'white',
  },
  subtitleUserRole: {
    fontWeight: '400',
    fontSize: 16,
    color: '#424762',
  },
});

export default ListOfTransferorsScreen;
