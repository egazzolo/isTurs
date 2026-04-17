import React from 'react';
import { SvgXml } from 'react-native-svg';

type Props = {
  xml: string;
  color?: string;
  width?: string | number;
  height?: string | number;
};


export function RenderSvgXML({ xml, color, width, height }: Props) {
  const params = {
    ...(color && { fill: color }),
    ...(width && { width }),
    ...(height && { height }),
    ...(xml
      ? {
          xml: typeof xml === 'string' ? xml : ''
        }
      : {
          xml: ''
        })
  };

  return <SvgXml {...params} />;
}
