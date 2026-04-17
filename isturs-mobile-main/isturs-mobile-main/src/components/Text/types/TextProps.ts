import { TextProps as RNTextProps, TextStyle } from 'react-native';

import { ColorsTypes } from '@app/components/Box/types/ColorTypes';

import { VariantTypes } from './VariantTypes';

export interface TextProps {
  children?: RNTextProps['children'];
  color?: ColorsTypes | undefined;
  fontFamily?: string | undefined;
  fontSize?: number | undefined;
  fontStyle?: 'normal' | 'italic' | undefined;
  variant?: VariantTypes;
  fontWeight?: TextStyle['fontWeight'];
  letterSpacing?: number | undefined;
  lineHeight?: number | undefined;
  textAlign?: TextStyle['textAlign'];
  textDecorationLine?: TextStyle['textDecorationLine'];
  textDecorationStyle?: TextStyle['textDecorationStyle'];
  textDecorationColor?: ColorsTypes | undefined;
  textShadowColor?: ColorsTypes | undefined;
  textShadowOffset?: { width: number; height: number } | undefined;
  textShadowRadius?: number | undefined;
  textTransform?: TextStyle['textTransform'];
  testID?: string | undefined;
  onPress?: () => void;
  style?: RNTextProps['style'];
  numberOfLines?: RNTextProps['numberOfLines'];
}
