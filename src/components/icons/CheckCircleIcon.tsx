import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

export function CheckCircleIcon({ size = 28, color = '#4a7c59' }: { size?: number; color?: string }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Circle cx={12} cy={12} r={10} fill={color} />
            <Path d="M8 12l3 3 5-5" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    );
}
