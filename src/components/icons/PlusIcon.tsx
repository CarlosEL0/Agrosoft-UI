import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { Colors } from '../../theme/colors';

export function PlusIcon() {
    return (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path
                d="M12 5v14M5 12h14"
                stroke={Colors.textLight}
                strokeWidth={2}
                strokeLinecap="round"
            />
        </Svg>
    );
}
