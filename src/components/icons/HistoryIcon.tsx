import React from 'react';
import Svg, { Path } from 'react-native-svg';

export function HistoryIcon({ color = '#fff', size = 18 }: { color?: string; size?: number }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Path d="M3 3v5h5" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M12 7v5l4 2" stroke={color} strokeWidth={2} strokeLinecap="round" />
        </Svg>
    );
}
