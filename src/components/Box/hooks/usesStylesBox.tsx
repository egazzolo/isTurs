


import { sizeMargin } from '../../../constants';
import { Colors } from '../../../theme';
import { BoxProps } from '../types';


const usesStylesBox = (props: BoxProps) => {
  const marginLeft = props.marginLeft ? sizeMargin[props.marginLeft] : undefined;
  const margin = props.margin ? sizeMargin[props.margin] : undefined;
  const marginBottom = props.marginBottom ? sizeMargin[props.marginBottom] : undefined;
  const marginHorizontal = props.marginHorizontal ? sizeMargin[props.marginHorizontal] : undefined;
  const marginRight = props.marginRight ? sizeMargin[props.marginRight] : undefined;
  const marginStart = props.marginStart ? sizeMargin[props.marginStart] : undefined;
  const marginEnd = props.marginEnd ? sizeMargin[props.marginEnd] : undefined;
  const marginTop = props.marginTop ? sizeMargin[props.marginTop] : undefined;
  const marginVertical = props.marginVertical ? sizeMargin[props.marginVertical] : undefined;
  const padding = props.padding ? sizeMargin[props.padding] : undefined;
  const paddingBottom = props.paddingBottom ? sizeMargin[props.paddingBottom] : undefined;
  const paddingEnd = props.paddingEnd ? sizeMargin[props.paddingEnd] : undefined;
  const paddingHorizontal = props.paddingHorizontal ? sizeMargin[props.paddingHorizontal] : undefined;
  const paddingLeft = props.paddingLeft ? sizeMargin[props.paddingLeft] : undefined;
  const paddingRight = props.paddingRight ? sizeMargin[props.paddingRight] : undefined;
  const paddingStart = props.paddingStart ? sizeMargin[props.paddingStart] : undefined;
  const paddingTop = props.paddingTop ? sizeMargin[props.paddingTop] : undefined;
  const paddingVertical = props.paddingVertical ? sizeMargin[props.paddingVertical] : undefined;
  const backgroundColor = props.backgroundColor ? Colors[props.backgroundColor] : 'transparent';
  const borderColor = props.borderColor ? Colors[props.borderColor] : 'transparent';

  return {
    padding,
    marginLeft,
    marginRight,
    marginHorizontal,
    marginTop,
    marginBottom,
    marginStart,
    marginEnd,
    margin,
    marginVertical,
    paddingBottom,
    paddingEnd,
    paddingHorizontal,
    paddingLeft,
    paddingRight,
    paddingStart,
    paddingTop,
    paddingVertical,
    backgroundColor,
    borderColor
  };
};

export default usesStylesBox;
