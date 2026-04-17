import React from 'react';
// @ts-ignore // TODO: Fix this
import AnimatedLoader from 'react-native-animated-loader';
import { Images } from '../../constants';


interface FullScreenLoaderProps {
  visible: boolean;
  backdropColor?: string;
  animationCustomStyle?: {
    width: number;
    height: number;
  };
  animationSpeed?: number;
}

const FullScreenLoader: React.FC<FullScreenLoaderProps> = ({
  visible,
  backdropColor,
  animationCustomStyle,
  animationSpeed
}) => {
  return (
    <AnimatedLoader
      visible={visible}
      overlayColor={backdropColor}
      source={Images.loader}
      animationStyle={animationCustomStyle}
      speed={animationSpeed}
    />
  );
};

export default FullScreenLoader;

FullScreenLoader.defaultProps = {
  backdropColor: "rgba(255,255,255, 0.8)",
  animationCustomStyle: { width: 150, height: 150 },
  animationSpeed: 1
};
