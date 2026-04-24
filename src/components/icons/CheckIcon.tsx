import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';
import { Colors } from '../../theme/colors';

export function CheckIcon() {
    return (
        <Svg width={64} height={64} viewBox="0 0 64 64" fill="none">
            <Circle cx={32} cy={32} r={32} fill="#e8ede9" />
            <Path d="M22 32l7 7 13-13" stroke={Colors.primary} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    );
}
