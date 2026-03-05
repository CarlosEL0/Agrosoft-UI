import { Colors } from '@/src/theme/colors';
import React from 'react';
import Svg, { Path } from 'react-native-svg';

export function TreeTabIcon({ active = false }: { active?: boolean }) {
    return (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path d="M12 22v-6"
                stroke={active ? Colors.primary : Colors.textLight} strokeWidth={1.8} strokeLinecap="round" />
            <Path d="M5 16l7-6 7 6H5z"
                stroke={active ? Colors.primary : Colors.textLight} strokeWidth={1.8} strokeLinejoin="round" fill="none" />
            <Path d="M7 10l5-5 5 5H7z"
                stroke={active ? Colors.primary : Colors.textLight} strokeWidth={1.8} strokeLinejoin="round" fill="none" />
        </Svg>
    );
}
