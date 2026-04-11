import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, Modal } from 'react-native';
import ImagePicker from '../../../../components/ImagePicker/ImagePicker';
import { useSelector } from 'react-redux';
import {
  selectUserProfile,
  selectUserRole,
} from '../../../../redux/slices/auth.slice';
import { Asset } from 'react-native-image-picker';
import usePost from '../../../../hook/usePostFetch';
import Alert from '../../../../services/Alert';
import ImageViewer from 'react-native-image-zoom-viewer';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function ProfileIMG({ data }: any) {
  const user = useSelector(selectUserProfile);
  const userRole = useSelector(selectUserRole);
  const { turistProgress } = data;
  const [turistInfo] = turistProgress;
  const [base64Img, setBase64Img] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const {
    postData,
    isLoading,
    error,
    data: ImgData,
  } = usePost({
    onSuccess: () => {
      Alert.success('Imagen subida con éxito');
      setBase64Img('');
    },
    onError: error => {
      Alert.warning("Ocurrió un error al subir la imagen");
      console.log(error.response);
    },
  });

  const handleImageSelected = (image: Asset) => {
    setBase64Img(`data:image/jpeg;base64,${image.base64 || ''}`);
  };

  useEffect(() => {
    if (base64Img) {
      const payload = {
        id_translation: turistInfo._id,
        image: base64Img,
      };
      postData('/uphold/editUpholdImage', payload);
    }
  }, [base64Img]);

  const getProfileImage = () => {
    return userRole === 'OPERATOR'
      ? turistInfo.turist_IMG
      : turistInfo.operator_IMG;
  };

  const getImageToUpload = () => {
    return userRole === 'OPERATOR'
      ? turistInfo.operator_IMG
      : turistInfo.turist_IMG;
  };

  const handleImagePress = () => {
    setIsModalVisible(true);
  };

  return (
    <View style={styles.profileContainer}>
      <ImagePicker
        onImageSelected={handleImageSelected}
        width={180}
        height={180}
        initialImageUri={getImageToUpload()}
        shouldPostDirectly={false}
      />
      <View style={styles.RecomendationContainer}>
        <Text style={styles.titleRecomendacion}>Recomendaciones</Text>
        <Text style={styles.textRecomendacion}>
          - Tomarse la foto lo más claro posible y enviar al turista.
        </Text>
        <Text style={styles.textRecomendacion}>
          - Si ya envió la foto evite cambiar de vestimenta.
        </Text>
        <Text style={styles.textRecomendacion}>
          - En caso el turista demore en salir o no lo puede ubicar, utilice el
          chat para brindarle su ubicación.
        </Text>
      </View>
      <View style={styles.imgUser}>
        <TouchableOpacity onPress={handleImagePress}>
          <Image source={{ uri: getProfileImage() }} style={styles.avatar} />
          <Icon name="zoom-in" size={30} color="#FFF" style={styles.zoomIcon} />
        </TouchableOpacity>
      </View>
      <Modal visible={isModalVisible} transparent={true}>
        <View style={styles.modalStyle}>
          <TouchableOpacity
            style={styles.closeIconStyle}
            onPress={() => setIsModalVisible(false)}
          >
            <Icon name="close" size={30} color="#FFF" />
          </TouchableOpacity>
          <ImageViewer
            imageUrls={[{ url: getProfileImage() || '' }]}
            onCancel={() => setIsModalVisible(false)}
            enableSwipeDown={true}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  profileContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botonGuardar: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 10,
    marginTop: 30,
    width: '60%',
  },
  textoBoton: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  RecomendationContainer: {
    backgroundColor: '#f8f8f8',
    padding: 20,
    borderRadius: 10,
    marginTop: 30,
    width: '90%',
  },
  titleRecomendacion: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
    textAlign: 'center',
  },
  textRecomendacion: {
    fontSize: 15,
    color: 'black',
    marginBottom: 5,
  },
  imgUser: {
    backgroundColor: 'white',
    width: 100,
    height: 100,
    position: 'absolute',
    top: 40,
    right: 50,
    borderRadius: 80,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 100,
    borderColor: 'white',
    borderWidth: 2,
  },
  zoomIcon: {
    position: 'absolute',
    bottom: 5,
    right: -10,
    backgroundColor: '#007AFF',
    borderRadius: 50,
    padding: 3,
  },
  modalStyle: {
    flex: 1,
    backgroundColor: 'black',
  },
  closeIconStyle: {
    position: 'absolute',
    top: 30,
    right: 30,
    zIndex: 1,
  },
});
