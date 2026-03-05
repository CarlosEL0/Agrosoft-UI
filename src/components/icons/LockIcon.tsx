import { Colors } from '@/src/theme/colors';
import React from 'react';
import Svg, { Path } from 'react-native-svg';

export function LockIcon() {
    return (
        <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
            <Path
                d="M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2z"
                stroke={Colors.textMedium}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M7 11V7a5 5 0 0110 0v4"
                stroke={Colors.textMedium}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}
