import React, {useEffect, useRef, useState} from 'react';
import {
  Keyboard,
  LayoutAnimation,
  Platform,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';

// Shrinks its content on iOS so whatever sits at its bottom stays above the
// keyboard. Android already resizes the window (windowSoftInputMode=adjustResize).
export default function KeyboardAwareView({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const ref = useRef<View>(null);
  const [padding, setPadding] = useState(0);

  useEffect(() => {
    if (Platform.OS !== 'ios') return;
    const change = Keyboard.addListener('keyboardWillChangeFrame', e => {
      ref.current?.measureInWindow((_x, y, _w, height) => {
        LayoutAnimation.configureNext({
          duration: e.duration || 250,
          update: {type: 'keyboard'},
        });
        setPadding(Math.max(0, y + height - e.endCoordinates.screenY));
      });
    });
    const hide = Keyboard.addListener('keyboardWillHide', e => {
      LayoutAnimation.configureNext({
        duration: e.duration || 250,
        update: {type: 'keyboard'},
      });
      setPadding(0);
    });
    return () => {
      change.remove();
      hide.remove();
    };
  }, []);

  return (
    <View ref={ref} style={[style, {paddingBottom: padding}]}>
      {children}
    </View>
  );
}
