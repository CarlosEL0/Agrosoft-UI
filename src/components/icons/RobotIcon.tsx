import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { Colors } from '../../theme/colors';

export function RobotIcon() {
    return (
        <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <Rect x={4} y={8} width={16} height={12} rx={3} stroke={Colors.primary} strokeWidth={2} />
            <Path d="M8 8V6a4 4 0 018 0v2M12 4v2" stroke={Colors.primary} strokeWidth={2} strokeLinecap="round" />
            <Circle cx={9} cy={14} r={1.5} fill={Colors.primary} />
            <Circle cx={15} cy={14} r={1.5} fill={Colors.primary} />
            <Path d="M10 18h4" stroke={Colors.primary} strokeWidth={2} strokeLinecap="round" />
            <Path d="M2 12h2M20 12h2" stroke={Colors.primary} strokeWidth={2} strokeLinecap="round" />
        </Svg>
    );
}
