import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { Colors } from '../../theme/colors';

export function PlantCircleIcon({ size = 56 }: { size?: number }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <Circle cx={32} cy={32} r={32} fill={Colors.primary} />
            <Path d="M32 44V32" stroke="#fff" strokeWidth={2} strokeLinecap="round" />
            <Path
                d="M32 38C32 38 24 35 22 27C22 27 30 23 34 31"
                stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none"
            />
            <Path
                d="M32 33C32 33 38 29 42 33C42 33 40 41 32 39"
                stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none"
            />
            <Rect x={26} y={44} width={12} height={8} rx={2} fill="#fff" opacity={0.9} />
        </Svg>
    );
}
