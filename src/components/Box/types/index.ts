import { ReactElement } from 'react';
import { FlexStyle } from 'react-native';

import { ColorsTypes } from './ColorTypes';
import { MarginTypes } from './MarginTypes';

export type FlexAlignType = 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';

export interface BoxProps {
  backfaceVisibility?: 'visible' | 'hidden' | undefined;
  borderBottomLeftRadius?: number | undefined;
  borderBottomRightRadius?: number | undefined;
  // TODO: improve this code

  backgroundColor?: ColorsTypes;
  borderColor?: ColorsTypes;
  borderRadius?: number | undefined;
  borderTopLeftRadius?: number | undefined;
  borderTopRightRadius?: number | undefined;
  opacity?: number | undefined;
  // TODO: improve this code
  children?: JSX.Element | JSX.Element[] | ReactElement | ReactElement[];
  alignContent?: FlexStyle['alignContent'];
  alignItems?: FlexStyle['alignItems'];
  alignSelf?: FlexStyle['alignSelf'];
  aspectRatio?: number | undefined;
  borderBottomWidth?: number | undefined;
  borderEndWidth?: number | string | undefined;
  borderLeftWidth?: number | undefined;
  borderRightWidth?: number | undefined;
  borderStartWidth?: number | string | undefined;
  borderTopWidth?: number | undefined;
  borderWidth?: number | undefined;
  bottom?: number | string | undefined;
  display?: 'none' | 'flex' | undefined;
  end?: number | string | undefined;
  flex?: number | undefined;
  flexBasis?: number | string | undefined;
  flexDirection?: FlexStyle['flexDirection'];
  flexGrow?: FlexStyle['flexGrow'];
  flexShrink?: number | undefined;
  flexWrap?: 'wrap' | 'nowrap' | 'wrap-reverse' | undefined;
  height?: number | string | undefined;
  justifyContent?: FlexStyle['justifyContent'];
  left?: number | string | undefined;
  margin?: MarginTypes;
  marginBottom?: MarginTypes;
  marginEnd?: MarginTypes;
  marginHorizontal?: MarginTypes;
  marginLeft?: MarginTypes;
  marginRight?: MarginTypes;
  marginStart?: MarginTypes;
  marginTop?: MarginTypes;
  marginVertical?: MarginTypes;
  maxHeight?: number | string | undefined;
  maxWidth?: number | string | undefined;
  minHeight?: number | string | undefined;
  minWidth?: number | string | undefined;
  overflow?: 'visible' | 'hidden' | 'scroll' | undefined;
  padding?: MarginTypes;
  paddingBottom?: MarginTypes;
  paddingEnd?: MarginTypes;
  paddingHorizontal?: MarginTypes;
  paddingLeft?: MarginTypes;
  paddingRight?: MarginTypes;
  paddingStart?: MarginTypes;
  paddingTop?: MarginTypes;
  paddingVertical?: MarginTypes;
  position?: 'absolute' | 'relative' | undefined;
  right?: number | string | undefined;
  start?: number | string | undefined;
  top?: number | string | undefined;
  width?: number | string | undefined;
  zIndex?: number | undefined;
}
