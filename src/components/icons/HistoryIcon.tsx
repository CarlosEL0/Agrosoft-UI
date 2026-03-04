import { Colors } from '@/src/theme/colors';
import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

export function HistoryIcon() {
    return (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Circle cx={12} cy={12} r={9} stroke={Colors.textLight} strokeWidth={1.8} />
            <Path d="M12 7v5l3 3" stroke={Colors.textLight} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    );
}
