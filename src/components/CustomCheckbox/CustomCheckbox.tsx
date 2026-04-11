import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; 

interface CustomCheckboxProps {
  label: string;
  checked: boolean;
  onCheck: () => void;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ label, checked, onCheck }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onCheck}>
      <View style={styles.iconBackground}>
        <Icon
          name={checked ? 'checkbox-marked' : 'checkbox-blank-outline'}
          size={24}
          color={checked ? '#FFF' : '#000'}
        />
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  iconBackground: {
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  
  },
  label: {
    marginLeft: 8,
    fontWeight:"500",
    color: '#FFF',
  },
});

export default CustomCheckbox;
