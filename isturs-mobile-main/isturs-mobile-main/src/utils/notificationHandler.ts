import messaging from '@react-native-firebase/messaging';
import {Alert} from 'react-native';

export const registerBackgroundHandler = () => {
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in background:', remoteMessage);
  });
};

export const requestNotificationPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  return enabled;
};