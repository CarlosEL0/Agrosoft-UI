import { Colors } from '@/src/theme/colors';
import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

export function RobotIcon({ color = Colors.textDark, size = 28 }: { color?: string; size?: number }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Rect x={3} y={8} width={18} height={13} rx={2} stroke={color} strokeWidth={1.5} />
            <Path d="M12 8V4" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
            <Circle cx={12} cy={3} r={1} fill={color} />
            <Circle cx={8.5} cy={13} r={1.5} fill={color} />
            <Circle cx={15.5} cy={13} r={1.5} fill={color} />
            <Path d="M9 17h6" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
        </Svg>
    );
}
