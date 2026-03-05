import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';
import { Colors } from '../../theme/colors';

export function CalendarIcon() {
    return (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Rect x={3} y={4} width={18} height={18} rx={2} stroke={Colors.textLight} strokeWidth={2} />
            <Path d="M16 2v4M8 2v4M3 10h18" stroke={Colors.textLight} strokeWidth={2} strokeLinecap="round" />
        </Svg>
    );
}
