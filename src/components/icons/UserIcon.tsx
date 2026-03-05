import { Colors } from '@/src/theme/colors';
import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

export function UserIcon() {
    return (
        <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
            <Path
                d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"
                stroke={Colors.textMedium}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Circle
                cx={12}
                cy={7}
                r={4}
                stroke={Colors.textMedium}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}
