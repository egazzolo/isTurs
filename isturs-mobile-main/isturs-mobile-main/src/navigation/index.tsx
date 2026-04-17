// navigation/index.tsx
import React, { useEffect } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {selectToken, selectUserRole} from '../redux/slices/auth.slice';
import App from './App';
import Auth from './Auth';
import Alert from '../services/Alert';

const NavigationIndex: React.FC = () => {
  const token = useSelector(selectToken);
  const role = useSelector(selectUserRole);

  const dispatch = useDispatch();

  useEffect(() => {
    Alert.setDispatch(dispatch);
  }, [dispatch]);

  if (!token) {
    return <Auth />;
  } else {
    switch (role) {
      case 'TURIST':
      case 'OPERATOR':
      case 'COMPANY':
        return <App />;
      default:
        return <Auth />;
    }
  }
};

export default NavigationIndex;
