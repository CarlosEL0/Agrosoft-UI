import { Colors } from '@/src/theme/colors';
import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

export function ImagePlaceholderIcon({ size = 40 }: { size?: number }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Rect x={2} y={2} width={20} height={20} rx={3} stroke={Colors.textLight} strokeWidth={1.5} />
            <Circle cx={8} cy={8} r={2} fill={Colors.textLight} />
            <Path d="M22 15l-6-6L2 22" stroke={Colors.textLight} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    );
}
