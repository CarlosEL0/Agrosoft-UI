import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { Colors } from '../../theme/colors';

export function ImageIcon() {
    return (
        <Svg width={32} height={32} viewBox="0 0 24 24" fill="none">
            <Rect
                x={3}
                y={3}
                width={18}
                height={18}
                rx={2}
                stroke={Colors.textLight}
                strokeWidth={1.5}
            />
            <Circle cx={8.5} cy={8.5} r={1.5} fill={Colors.textLight} />
            <Path
                d="M21 15l-5-5L5 21"
                stroke={Colors.textLight}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}
