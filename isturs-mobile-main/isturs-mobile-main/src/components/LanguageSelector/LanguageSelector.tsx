import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {setLanguage, selectLanguage} from '../../redux/slices/app.slice';

type Variant = 'light' | 'dark';

interface Props {
  variant?: Variant;
}

const LANGUAGES = [
  {code: 'es' as const, label: 'ES'},
  {code: 'en' as const, label: 'EN'},
  {code: 'pt' as const, label: 'PT'},
];

const LanguageSelector: React.FC<Props> = ({variant = 'light'}) => {
  const dispatch = useDispatch();
  const currentLanguage = useSelector(selectLanguage);
  const isLight = variant === 'light';

  return (
    <View style={styles.container}>
      {LANGUAGES.map(({code, label}) => {
        const isActive = currentLanguage === code;
        return (
          <TouchableOpacity
            key={code}
            onPress={() => dispatch(setLanguage(code))}
            style={[
              styles.button,
              isLight ? styles.buttonLight : styles.buttonDark,
              isActive && (isLight ? styles.activeLight : styles.activeDark),
            ]}>
            <Text
              style={[
                styles.label,
                isLight ? styles.labelLight : styles.labelDark,
                isActive &&
                  (isLight ? styles.activeLabelLight : styles.activeLabelDark),
              ]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
  },
  buttonLight: {
    borderColor: 'rgba(255,255,255,0.5)',
  },
  activeLight: {
    backgroundColor: '#ffffff',
    borderColor: '#ffffff',
  },
  labelLight: {
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600',
    fontSize: 13,
  },
  activeLabelLight: {
    color: '#333333',
  },
  buttonDark: {
    borderColor: 'rgba(0,0,0,0.2)',
  },
  activeDark: {
    backgroundColor: '#333333',
    borderColor: '#333333',
  },
  labelDark: {
    color: 'rgba(0,0,0,0.4)',
    fontWeight: '600',
    fontSize: 13,
  },
  activeLabelDark: {
    color: '#ffffff',
  },
});

export default LanguageSelector;