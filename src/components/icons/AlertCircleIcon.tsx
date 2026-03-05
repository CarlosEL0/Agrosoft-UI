import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

export function AlertCircleIcon({ size = 28 }: { size?: number }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Circle cx={12} cy={12} r={10} fill="#d32f2f" />
            <Path d="M12 8v4M12 16h.01" stroke="#fff" strokeWidth={2} strokeLinecap="round" />
        </Svg>
    );
}
