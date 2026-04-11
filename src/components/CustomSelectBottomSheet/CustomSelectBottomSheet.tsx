import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import IconMaterialIcons from "react-native-vector-icons/MaterialIcons";
import { onOpen, Picker } from "react-native-actions-sheet-picker";


type Props = {
  id?: string;
  items: any[];
  label?: string;
  selected?: any;
  isValid?: boolean;
  bottomDescription?: string;
  textButton: string | number;
  onSelect: (item: any) => void;
  marginTop?: number;
  marginBottom?: number;
  loading?: boolean;
  disabled?: any;
};

const CustomSelectBottomSheet = forwardRef((props: Props, ref) => {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(undefined);
  const [isValid, setIsValid] = useState(props.isValid ?? true);

  const additionalStyles = {
    marginTop: props.marginTop ? props.marginTop : 0,
    marginBottom: props.marginBottom ? props.marginBottom : 0,
  };

  useEffect(() => {
    setData(props.items ?? []);
  }, [props.items]);

  useEffect(() => {
    if (props.selected) {
      setIsValid(true);
      setSelected(props.selected);
    }
  }, [props.selected]);

  const onSelected = (item: any) => {
    setSelected(item);
    props.onSelect(item);
  };

  useImperativeHandle(ref, () => ({
    validate: () => {
      if (!selected) {
        setIsValid(false);
      }
    },
  }));
  const isValidInput = props.isValid ?? isValid;

  return (
    <View>
      <TouchableOpacity
        style={[
          styles.button,
          !isValidInput && styles.inputTextDanger,
          additionalStyles,
          props.disabled && styles.buttonDisabled,
        ]}
        onPress={() => {
          onOpen(props.id ?? "select");
        }}
        disabled={props.disabled}
      >
        <Text style={styles.textLabel}>
          {selected?.name ?? props.textButton ?? "Selecciona una opción"}
        </Text>
        <IconMaterialIcons
          size={24}
          name="keyboard-arrow-down"
          color={props.disabled ? "#CFCFCF" : "black"}
          
        />
      </TouchableOpacity>
      {!isValidInput && (
        <View style={{ paddingLeft: 4, marginTop: 2 }}>
          <Text style={{ color: isValidInput ? "#CFCFCF" : "red", fontSize: 10 }}>
            {props.bottomDescription}
          </Text>
        </View>
      )}
      <Picker
        data={data}
        searchable={false}
        closeText="Cerrar"
        setSelected={onSelected}
        id={props.id ?? "select"}
        placeholderTextColor="red"
        label={props.label ?? "Selecciona una opción"}
        noDataFoundText="No se encontraron resultados"
        loading={props.loading}
      />
    </View>
  );
});

export default CustomSelectBottomSheet;

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    borderRadius:12.5,

    borderWidth: 1,
    borderColor: "#CFCFCF", // Cambiar según el color real de ThemeColors.tertiary
    height: 45,
    paddingHorizontal: 16,
    backgroundColor:"white",
    zIndex:150
  },
  textLabel: {
    color: "black",
  },
  inputTextDanger: {
    borderWidth: 1,
    borderColor: "red",
  },
  buttonDisabled: {
    backgroundColor: "#E0E0E0", // Un gris claro, ajusta según tu diseño
    borderColor: "#CFCFCF",
  },
});
