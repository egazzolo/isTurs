import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {useDispatch} from 'react-redux';
import {setLanguage} from '../../redux/slices/app.slice';
import {useTranslation, Language} from '../../i18n';

const languages: {code: Language; label: string}[] = [
  {code: 'es', label: 'ES'},
  {code: 'en', label: 'EN'},
  {code: 'pt', label: 'PT'},
];

interface Props {
  variant?: 'light' | 'dark';
}

export default function LanguageSelector({variant = 'dark'}: Props) {
  const dispatch = useDispatch();
  const {language} = useTranslation();
  const isLight = variant === 'light';

  return (
    <View style={styles.container}>
      {languages.map(lang => (
        <TouchableOpacity
          key={lang.code}
          onPress={() => dispatch(setLanguage(lang.code))}
          style={[
            styles.btn,
            isLight ? styles.btnLight : styles.btnDark,
            language === lang.code &&
              (isLight ? styles.activeBtnLight : styles.activeBtnDark),
          ]}>
          <Text
            style={[
              styles.text,
              isLight ? styles.textLight : styles.textDark,
              language === lang.code &&
                (isLight ? styles.activeTextLight : styles.activeTextDark),
            ]}>
            {lang.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
  },
  btn: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
  },
  btnDark: {
    borderColor: '#cccccc',
  },
  btnLight: {
    borderColor: 'rgba(255,255,255,0.5)',
  },
  activeBtnDark: {
    backgroundColor: '#0373f3',
    borderColor: '#0373f3',
  },
  activeBtnLight: {
    backgroundColor: 'white',
    borderColor: 'white',
  },
  text: {
    fontWeight: '600',
    fontSize: 13,
  },
  textDark: {
    color: '#666666',
  },
  textLight: {
    color: 'rgba(255,255,255,0.7)',
  },
  activeTextDark: {
    color: 'white',
  },
  activeTextLight: {
    color: '#0373f3',
  },
});
