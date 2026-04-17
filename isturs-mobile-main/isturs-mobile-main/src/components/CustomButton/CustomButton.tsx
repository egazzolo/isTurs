// components/CustomButton.tsx
import React from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps, StyleSheet } from 'react-native';
import { SIZES_MEDIUM } from '../../constants/fonts';

type CustomButtonProps = TouchableOpacityProps & {
  title: string;
  invert?: boolean;
};

export const CustomButton: React.FC<CustomButtonProps> = ({ title, invert, style, ...props }) => {
  return (
    <TouchableOpacity
      {...props}
      style={[
        styles.button,
        invert ? styles.invertedButton : styles.normalButton,
        style,
      ]}
    >
      <Text style={[styles.text, invert ? styles.invertedText : styles.normalText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
  width:"100%",
  paddingVertical:12,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'blue',
    backgroundColor: 'white',
    marginVertical: 5,
  },
  normalButton: {
    borderColor: 'transparent',
    backgroundColor: '#1177bf',
  },
  invertedButton: {
    borderColor: '#1177bf',
    backgroundColor: 'white',
  },
  text: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize:SIZES_MEDIUM.XMEDIUM
  },
  normalText: {
    color: 'white',
  },
  invertedText: {
    color: '#1177bf',
  },
});
