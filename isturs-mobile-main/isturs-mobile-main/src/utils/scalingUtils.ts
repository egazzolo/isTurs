import { PixelRatio } from 'react-native';


import { SIZES, SIZES_MEDIUM, SIZES_SMALL } from '../constants/fonts';
import { IS_MEDIUM_DEVICE, IS_SMALL_DEVICE, WINDOW_HEIGHT, WINDOW_WIDTH } from '../constants/platform';

interface fontsSizes {
  XXSMALL: number;
  XSMALL: number;
  SMALL: number;
  MEDIUM: number;
  XMEDIUM: number;
  XXMEDIUM: number;
  BIG: number;
  XBIG: number;
  XXBIG: number;
}

const [shortDimension, longDimension] =
  WINDOW_WIDTH < WINDOW_HEIGHT ? [WINDOW_WIDTH, WINDOW_HEIGHT] : [WINDOW_HEIGHT, WINDOW_WIDTH];

// Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 350;
const scaleFactor = 0.5;

const scale = (size: number) => (shortDimension / guidelineBaseWidth) * size;

const moderateScale = (size: number, factor: number = scaleFactor) => size + (scale(size) - size) * factor;

const fontScale = (size: number) => {
  const key: string = Object.keys(SIZES)[Object.values(SIZES).indexOf(size)];

  if (IS_SMALL_DEVICE) {
    return SIZES_SMALL[key as keyof fontsSizes];
  }

  if (IS_MEDIUM_DEVICE) {
    return SIZES_MEDIUM[key as keyof fontsSizes];
  }

  return size;
};

const getAdjustedSize = (originalSize: number, pixelDensity: number, isHeight: boolean = false) => {
  const newSize = scale(originalSize);
  if (pixelDensity >= 3.3 && pixelDensity < 3.5) {
    const res = isHeight
      ? Math.round(PixelRatio.roundToNearestPixel(newSize + 8 * pixelDensity))
      : Math.round(PixelRatio.roundToNearestPixel(newSize + 1));
    return res;
  }
  if (pixelDensity > 3.5 && pixelDensity < 4) {
    const res = isHeight
      ? Math.round(PixelRatio.roundToNearestPixel(newSize + pixelDensity))
      : Math.round(PixelRatio.roundToNearestPixel(newSize - 2));
    return res;
  }
  if (pixelDensity >= 4 && pixelDensity < 4.5) {
    const res = isHeight
      ? Math.round(PixelRatio.roundToNearestPixel(newSize + 3 * pixelDensity))
      : Math.round(PixelRatio.roundToNearestPixel(newSize));
    return res;
  }
  if (pixelDensity >= 4.5) {
    const res = isHeight
      ? Math.round(PixelRatio.roundToNearestPixel(newSize + 6 * pixelDensity))
      : Math.round(PixelRatio.roundToNearestPixel(newSize + 2));
    return res;
  }
  return originalSize;
};

const applyScaling = PixelRatio.get() > 3 && PixelRatio.get() !== 3.5;

export { applyScaling, fontScale, getAdjustedSize, moderateScale, scale };

