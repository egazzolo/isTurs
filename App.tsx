import React, { useEffect } from 'react';

import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {PersistGate} from 'redux-persist/integration/react';
import Navigation from './src/navigation';
import {persistStore} from 'redux-persist';
import store from './src/redux/store';
import {Provider, useDispatch} from 'react-redux';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Toast from './src/services/AlertServices/Toast';
import Alert from './src/services/Alert';

let persistor = persistStore(store);

const queryClient = new QueryClient();

function App(): React.JSX.Element {
  

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Navigation />
          </PersistGate>
          <Toast />
        </Provider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

export default App;
