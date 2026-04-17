import { Dimensions } from 'react-native';

const windowDimensions = Dimensions.get('window');
export const WINDOW_HEIGHT = windowDimensions.height;
export const WINDOW_WIDTH = windowDimensions.width;

export const IS_SMALL_DEVICE = WINDOW_WIDTH <= 320 && WINDOW_HEIGHT <= 568;
export const IS_MEDIUM_DEVICE = !IS_SMALL_DEVICE && WINDOW_WIDTH <= 360 && WINDOW_HEIGHT < 640;
