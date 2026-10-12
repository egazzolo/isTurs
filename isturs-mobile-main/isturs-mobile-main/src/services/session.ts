import messaging from '@react-native-firebase/messaging';
import axiosClient from '../api';
import {setSignIn} from '../redux/slices/auth.slice';
import type {RegisterResponse} from '../views/auth/Login';

const IMAGE_URL_PLACEHOLDER =
  'https://surgassociates.com/wp-content/uploads/610-6104451_image-placeholder-png-user-profile-placeholder-image-png.jpg';

// Stores the session returned by /auth/login and registers the device for push.
export function completeSignIn(dispatch: any, data: RegisterResponse) {
  dispatch(
    setSignIn({
      usuario: {
        ...data.usuario,
        imageUrl: IMAGE_URL_PLACEHOLDER,
      },
      token: data.token,
    }),
  );
  messaging()
    .getToken()
    .then(fcmToken => {
      if (fcmToken) {
        axiosClient.post('/chats/saveFcmToken', {fcmToken});
      }
    })
    .catch(err => console.log('FCM token error:', err));
}

// Used right after registration so new users land in the app already signed in.
export async function signIn(
  dispatch: any,
  username: string,
  password: string,
) {
  const {data} = await axiosClient.post<RegisterResponse>('/auth/login', {
    username,
    password,
  });
  completeSignIn(dispatch, data);
}
