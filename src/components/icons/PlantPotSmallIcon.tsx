import { Colors } from '@/src/theme/colors';
import * as React from 'react';
import { Path, Rect, Svg } from 'react-native-svg';

export function PlantPotSmallIcon({ size = 44 }: { size?: number }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 56 56" fill="none">
            <Path d="M16 36h24l-3 10H19L16 36z" fill={Colors.textDark} />
            <Rect x={14} y={32} width={28} height={6} rx={2} fill={Colors.textDark} />
            <Path d="M28 32V20" stroke={Colors.textDark} strokeWidth={2} strokeLinecap="round" />
            <Path d="M28 26C28 26 20 24 18 16C18 16 26 12 30 20"
                stroke={Colors.textDark} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <Path d="M28 22C28 22 34 18 38 22C38 22 36 30 28 28"
                stroke={Colors.textDark} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </Svg>
    );
}
