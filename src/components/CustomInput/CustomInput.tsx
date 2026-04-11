// components/CustomInput.tsx
import React, { useState } from 'react';
import { TextInput, TextInputProps, View, TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/Feather'; // Cambiado a Feather para usar el icono de ojo recomendado

interface CustomInputProps extends TextInputProps {
  isSecure?: boolean;
  iconSize?: number;
  iconColor?: string;
  containerStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

const CustomInput: React.FC<CustomInputProps> = ({
  isSecure,
  disabled = false,
  iconSize = 24,
  iconColor = '#000000',
  containerStyle,
  ...props
}) => {
  const [secureEntry, setSecureEntry] = useState(isSecure);
  const iconContainerWidth = iconSize + 20; 

  return (
    <View style={[styles.inputContainer, containerStyle,disabled && styles.disabledContainer]}>
      <TextInput
      editable={!disabled}
        {...props}
        secureTextEntry={isSecure ? secureEntry : false}
        style={[
          styles.input,
          isSecure ? { paddingRight: iconContainerWidth } : {},
          { width: '100%' },
          disabled && styles.disabledInput
        ]}
        placeholderTextColor="#00000089"
      />
      {isSecure && (
        <TouchableOpacity
          onPress={() => setSecureEntry(!secureEntry)}
          style={[styles.icon, { width: iconContainerWidth }]}
        >
          <Icon name={secureEntry ? 'eye-off' : 'eye'} size={iconSize} color={iconColor} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius:12.5,
    borderWidth: 1,
    borderColor: 'rgba(28, 26, 26, 0.4)',
    marginTop: 5,
  },
  input: {
    color: '#000',
    paddingVertical: 8,
    paddingHorizontal:15
  },
  icon: {
    position: 'absolute',
    right: 0,
    zIndex: 10,
  },
  disabledContainer: {
    backgroundColor: '#E0E0E0', // Un color de fondo para indicar que está deshabilitado
    borderColor: '#CFCFCF', // Opcionalmente, cambia el color del borde
  },
  disabledInput: {
    color: '#A0A0A0', // Cambia el color del texto para indicar que está deshabilitado
  },
});

export default CustomInput;
