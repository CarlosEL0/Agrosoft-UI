import { Colors } from '@/src/theme/colors';
import * as React from 'react';
import { Circle, Path, Svg } from 'react-native-svg';

export function BellIcon() {
    return (
        <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
            <Path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"
                stroke={Colors.textDark} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M13.73 21a2 2 0 01-3.46 0"
                stroke={Colors.textDark} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            <Circle cx={18} cy={5} r={4} fill={Colors.textDark} />
            <Path d="M18 3v4M16 5h4" stroke="#fff" strokeWidth={1.2} strokeLinecap="round" />
        </Svg>
    );
}
