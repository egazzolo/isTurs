import { BoxProps } from '../types';

import usesStylesBox from './usesStylesBox';

export const usePropsBoxStyles = (props: BoxProps) => {
  const {
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
  } = usesStylesBox(props);

  const propsStyles = {
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
  };
  return {
    propsStyles
  };
};
