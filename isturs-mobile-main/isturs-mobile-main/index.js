import messaging from '@react-native-firebase/messaging';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in background:', remoteMessage);
});

if (__DEV__) {
  import('./ReactotronConfig').then(() => console.log('Reactotron Configured'));
}
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
AppRegistry.registerComponent(appName, () => App);