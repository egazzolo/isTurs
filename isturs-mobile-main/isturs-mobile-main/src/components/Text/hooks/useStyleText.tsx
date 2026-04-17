import { Colors } from '@constants/colors';
import { variantFonts } from '@constants/variantFonts';

import { TextProps } from '../types/TextProps';

const useStyleText = (props: TextProps) => {
  const color = props.color ? Colors[props.color] : 'black';
  const textShadowColor = props.textShadowColor ? Colors[props.textShadowColor] : 'transparent';
  const textDecorationColor = props.textDecorationColor ? Colors[props.textDecorationColor] : 'transparent';
  const variant = props.variant ? variantFonts[props.variant] : {};

  return { color, textShadowColor, textDecorationColor, variant };
};

export default useStyleText;
