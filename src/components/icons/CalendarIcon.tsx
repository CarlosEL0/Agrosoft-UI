import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';
import { Colors } from '../../theme/colors';

export function CalendarIcon({ color = Colors.textLight, size = 24 }: { color?: string; size?: number }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Rect x={3} y={4} width={18} height={18} rx={2} stroke={color} strokeWidth={2} />
            <Path d="M16 2v4M8 2v4M3 10h18" stroke={color} strokeWidth={2} strokeLinecap="round" />
        </Svg>
    );
}
