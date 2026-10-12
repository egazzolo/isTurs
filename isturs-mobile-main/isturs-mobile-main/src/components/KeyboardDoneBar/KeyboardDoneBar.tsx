import React, {useEffect, useState} from 'react';
import {
  InputAccessoryView,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTranslation} from '../../i18n';

// Give a TextInput inputAccessoryViewID={KEYBOARD_DONE_ID} to show the bar on iOS.
export const KEYBOARD_DONE_ID = 'keyboardDone';

// A "Done" bar that hides the keyboard. On iOS it is attached to the keyboard;
// on Android it shows while the keyboard is open, so render it at the bottom
// of the screen layout (adjustResize keeps it right above the keyboard).
export default function KeyboardDoneBar() {
  const {t} = useTranslation();
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'ios') return;
    const show = Keyboard.addListener('keyboardDidShow', () =>
      setKeyboardVisible(true),
    );
    const hide = Keyboard.addListener('keyboardDidHide', () =>
      setKeyboardVisible(false),
    );
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  const bar = (
    <View style={styles.bar}>
      <TouchableOpacity
        onPress={Keyboard.dismiss}
        hitSlop={{top: 10, bottom: 10, left: 20, right: 20}}>
        <Text style={styles.text}>{t.done}</Text>
      </TouchableOpacity>
    </View>
  );

  if (Platform.OS === 'ios') {
    return (
      <InputAccessoryView nativeID={KEYBOARD_DONE_ID}>{bar}</InputAccessoryView>
    );
  }
  return keyboardVisible ? bar : null;
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#F1F1F1',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#C3C3C3',
  },
  text: {
    color: '#0373F3',
    fontSize: 17,
    fontWeight: '600',
  },
});
