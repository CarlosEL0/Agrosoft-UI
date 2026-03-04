import { Colors } from '@/src/theme/colors';
import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

export function TreeCircleIcon({ size = 28 }: { size?: number }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Circle cx={12} cy={12} r={10} fill={Colors.primary} />
            <Path d="M12 18v-4" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" />
            <Path d="M8 14l4-4 4 4H8z" stroke="#fff" strokeWidth={1.5} strokeLinejoin="round" fill="none" />
            <Path d="M9 10l3-3 3 3H9z" stroke="#fff" strokeWidth={1.5} strokeLinejoin="round" fill="none" />
        </Svg>
    );
}
