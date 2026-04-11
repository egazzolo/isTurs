// CustomModal.tsx
import React from 'react';
import {  StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import Modal from 'react-native-modal';

interface CustomModalProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const CustomModal: React.FC<CustomModalProps> = ({ isVisible, onClose, children }) => {
  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose} onBackButtonPress={onClose}>
      <View style={styles.modalContent}>
        {children}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  // Puedes agregar más estilos aquí si lo necesitas
});

export default CustomModal;
