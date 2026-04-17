import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps, TextProps, StyleProp, ViewStyle, TextStyle } from 'react-native';

interface CustomButtonProps extends TouchableOpacityProps {
  textProps?: TextProps;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const ButtonOpacity: React.FC<CustomButtonProps> = ({ textProps, containerStyle, textStyle, children, ...props }) => {
  return (
    <TouchableOpacity style={containerStyle} {...props}>
      <Text style={textStyle} {...textProps}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

export default ButtonOpacity;
