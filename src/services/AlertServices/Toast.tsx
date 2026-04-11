
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Vibration, Dimensions } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { hideToast } from '../../redux/slices/toast.slice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';


const Success = '#28A745';
const Info = '#2B99D2';
const Warning = '#DC3545';

const Toast = () => {
  const { isVisible, message, type } = useSelector((state: RootState) => state.toastSlice);
  const dispatch = useDispatch<AppDispatch>();

  const screenWidth = Dimensions.get('window').width;
  const opacity = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      handleAnimated();
    }
  }, [isVisible]);

  const handleAnimated = () => {
    Vibration.vibrate();
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(progress, {
        toValue: screenWidth, // End at the full width of the screen
        duration: 4500,
        useNativeDriver: false, // Must be false when animating width directly
      })
    ]).start(({ finished }) => {
      if (finished) {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }).start(() => {
          progress.setValue(0);
          dispatch(hideToast()); 
        });
      }
    });
  };

  const animatedContainer = { opacity };
  const progressStyles = {
    width: progress,
  };
  if (!isVisible) return null;

  return (
    <Animated.View style={[styles.container, animatedContainer]}>
      <View style={[styles.box, { backgroundColor: type === 1 ? Success : type === 2 ? Info : Warning }]}>
        <View style={styles.icon}>
          {type === 1 ? (
            <FontAwesome name="check" size={15} color={Success} />
          ) : type === 2 ? (
            <FontAwesome name="info" size={15} color={Info} />
          ) : (
            <MaterialIcon name="exclamation-thick" size={15} color={Warning} />
          )}
        </View>
        <View style={styles.titleBox}>
          <Text style={styles.title}>{message}</Text>
        </View>
      </View>
      <View style={styles.progressContainer}>
        <Animated.View style={[styles.progress, progressStyles]} />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
    container: {
        height: 'auto',
        width: '100%',
        position: 'absolute',
        bottom: 0,
        overflow: 'hidden',
        zIndex: 100
    },
    box: {
        height: 'auto',
        alignSelf: 'stretch',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        flexDirection: 'row'
    },
    icon: {
        width: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
        paddingLeft: 1,
        backgroundColor: '#fff',
        borderRadius: 25
    },
    titleBox: {
        width: '90%',
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    title: {
        fontWeight: '700',
        fontSize: 14,
        color: '#fff'
    },
    progressContainer: {
        height: 'auto',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'flex-start',
        backgroundColor: '#fff'
    },
    progress: {
        height: 2.5,
        backgroundColor: '#ffc107'
    }
})
export default Toast;

