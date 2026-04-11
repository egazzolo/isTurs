import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet
} from 'react-native';
import {Asset, launchImageLibrary} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Colors} from '../../theme';
import usePost from '../../hook/usePostFetch';

interface ImagePickerProps {
  initialImageUri?: string;
  onImageSelected: (image: Asset) => void;
  width?: number;
  height?: number;
  shouldPostDirectly?: boolean; 
  postEndpoint?: string;
}

const ImagePicker: React.FC<ImagePickerProps> = ({
  initialImageUri,
  onImageSelected,
  width = 75,
  height = 75,
  shouldPostDirectly = true, // Default to true if not provided
  postEndpoint = '/uphold/upholdImage', // Default endpoint if not provided
}) => {
  const [imageUri, setImageUri] = useState<string | undefined>(initialImageUri);
  const iconSize = width * 0.3;

  const { postData, data, isLoading, error } = usePost<any>({
    onSuccess: () => console.log("Imagen cargada con éxito"),
    onError: (err) => console.log("Error al cargar imagen:", err)
  });


  const handleChoosePhoto = () => {
    launchImageLibrary({ includeBase64: true, mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets[0]) {
        const selectedImage = response.assets[0];
        const imageSource = selectedImage.uri || '';
        setImageUri(imageSource);
        onImageSelected(selectedImage);
        // Check if we should post directly
        if (shouldPostDirectly && selectedImage.base64) {
          const base64Image = `data:image/jpeg;base64,${selectedImage.base64}`;
          postData(postEndpoint, { image: base64Image });
        }
      }
    });
  };

  const styles = StyleSheet.create({
    container: {
      width,
      height,
      position: 'relative',
    },
    imageStyle: {
      width: '100%',
      height: '100%',
      borderRadius: 100,
      backgroundColor: 'grey',
    },
    iconStyle: {
      position: 'absolute',
      left: -(iconSize * 0.20),
      bottom: -(iconSize * 0.20),
      backgroundColor: Colors.primary,
      padding: iconSize * 0.25,
      borderRadius: width / 2,
      alignItems: 'center',
      justifyContent: 'center',
      width: iconSize * 1.2,
      height: iconSize * 1.2,
    },
  });

  return (
    <View style={styles.container}>
      <Image
        source={{uri: imageUri || 'path/to/your/default/image'}}
        style={styles.imageStyle}
      />
      <TouchableOpacity style={styles.iconStyle} onPress={handleChoosePhoto}>
        <Icon name="photo-camera" size={iconSize * 0.5} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

export default ImagePicker;
