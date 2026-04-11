import React from 'react';
import { View } from 'react-native';



import usesStylesBox from './hooks/usesStylesBox';
import { BoxProps } from './types';
import { ThemeColors } from '../../theme';

export const Box = (props: BoxProps) => {
  const {
    backgroundColor = ThemeColors.white,
    borderColor,
    marginLeft,
    margin,
    marginBottom,
    marginTop,
    marginStart,
    marginEnd,
    marginHorizontal,
    marginVertical,
    marginRight,
    padding,
    paddingBottom,
    paddingEnd,
    paddingHorizontal,
    paddingLeft,
    paddingRight,
    paddingStart,
    paddingTop,
    paddingVertical
  } = usesStylesBox(props);

  return (
    <View
      style={{
        ...props,
        backgroundColor,
        borderColor,
        marginLeft,
        margin,
        marginBottom,
        marginTop,
        marginStart,
        marginEnd,
        marginHorizontal,
        marginVertical,
        marginRight,
        padding,
        paddingBottom,
        paddingEnd,
        paddingHorizontal,
        paddingLeft,
        paddingRight,
        paddingStart,
        paddingTop,
        paddingVertical
      }}>
      {props.children}
    </View>
  );
};
