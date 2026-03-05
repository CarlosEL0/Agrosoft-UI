import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';
import { Colors } from '../../theme/colors';

export function BackIcon() {
    return (
        <Svg width={44} height={44} viewBox="0 0 44 44" fill="none">
            <Circle cx={22} cy={22} r={22} fill={Colors.buttonSecundary} />
            <Path
                d="M25 14l-8 8 8 8"
                stroke="#fff"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}
