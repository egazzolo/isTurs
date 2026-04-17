import React from 'react';
import { StyleSheet, Text as RNText } from 'react-native';


import useStyleText from './hooks/useStyleText';
import { TextProps } from './types/TextProps';
import { removeProps } from '@utils/index';

export const Text = (props: TextProps) => {
  const { color, textShadowColor, textDecorationColor, variant } = useStyleText(props);

  const style = StyleSheet.flatten(props.style || {});
  const { children, ...restProps } = props;

  type RemoveProps = keyof TextProps;
  const newRestProps = removeProps<TextProps, RemoveProps>(restProps, ['variant', 'onPress', 'style', 'numberOfLines']);

  return (
    <RNText
      style={{
        ...newRestProps,
        color,
        textShadowColor,
        textDecorationColor,
        ...variant,
        ...style
      }}
      numberOfLines={props.numberOfLines}
      onPress={props.onPress}>
      {children}
    </RNText>
  );
};
