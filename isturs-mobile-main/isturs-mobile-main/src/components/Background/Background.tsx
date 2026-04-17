// components/Background.js
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { RenderSvgXML } from '../RenderSvgXML';

type BackgroundProps = {
  xml: string;
  width?: string | number;
  height?: string | number;
  darkOverlay?: boolean; 
};

export const Background = ({ xml, width = '100%', height = '100%', darkOverlay = false }: BackgroundProps) => {
  return (
    <View style={styles.container}>
      <RenderSvgXML xml={xml} width={width} height={height} />
      {darkOverlay && <View style={styles.darkOverlay} />} 
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
});
