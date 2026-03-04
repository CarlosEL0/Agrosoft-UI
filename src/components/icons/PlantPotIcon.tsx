import { Colors } from '@/src/theme/colors';
import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

export function PlantPotIcon({ size = 52 }: { size?: number }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <Rect x={16} y={36} width={32} height={22} rx={4} fill={Colors.primary} />
            <Path d="M20 36l4-10h16l4 10H20z" fill={Colors.primary} opacity={0.7} />
            <Path d="M32 36V22" stroke="#fff" strokeWidth={2} strokeLinecap="round" />
            <Path d="M32 28c0 0-6-3-8-9 0 0 6-2 10 6" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" fill="none" />
            <Path d="M32 24c0 0 4-4 8-3 0 0 0 6-8 5" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" fill="none" />
        </Svg>
    );
}
