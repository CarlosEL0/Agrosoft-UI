import { Colors } from '@/src/theme/colors';
import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

export function EyeIcon({ off }: { off: boolean }) {
    return (
        <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            {off ? (
                <>
                    <Path
                        d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"
                        stroke={Colors.textLight}
                        strokeWidth={1.5}
                        strokeLinecap="round"
                    />
                    <Path
                        d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"
                        stroke={Colors.textLight}
                        strokeWidth={1.5}
                        strokeLinecap="round"
                    />
                    <Path
                        d="M1 1l22 22"
                        stroke={Colors.textLight}
                        strokeWidth={1.5}
                        strokeLinecap="round"
                    />
                </>
            ) : (
                <>
                    <Path
                        d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                        stroke={Colors.textLight}
                        strokeWidth={1.5}
                        strokeLinecap="round"
                    />
                    <Circle cx="12" cy="12" r="3" stroke={Colors.textLight} strokeWidth={1.5} />
                </>
            )}
        </Svg>
    );
}
