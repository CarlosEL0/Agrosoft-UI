import { Colors } from '@/src/theme/colors';
import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

export function SearchIcon() {
    return (
        <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <Circle cx={11} cy={11} r={8} stroke={Colors.textLight} strokeWidth={1.8} />
            <Path d="M21 21l-4.35-4.35" stroke={Colors.textLight} strokeWidth={1.8} strokeLinecap="round" />
        </Svg>
    );
}
