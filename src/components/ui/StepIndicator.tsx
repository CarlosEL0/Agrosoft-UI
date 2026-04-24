import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../../theme/colors';

interface StepIndicatorProps {
    current: number;
    total?: number;
}

export function StepIndicator({ current, total = 2 }: StepIndicatorProps) {
    return (
        <View style={styles.stepIndicator}>
            {Array.from({ length: total }).map((_, i) => {
                const step = i + 1;
                return (
                    <React.Fragment key={step}>
                        <View
                            style={[
                                styles.stepDot,
                                current >= step && styles.stepDotActive,
                            ]}
                        />
                        {i < total - 1 && (
                            <View
                                style={[
                                    styles.stepLine,
                                    current > step && styles.stepLineActive,
                                ]}
                            />
                        )}
                    </React.Fragment>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    stepIndicator: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    stepDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#d0d8d2',
    },
    stepDotActive: {
        backgroundColor: Colors.primary,
    },
    stepLine: {
        flex: 1,
        height: 2,
        backgroundColor: '#d0d8d2',
        marginHorizontal: 4,
    },
    stepLineActive: {
        backgroundColor: Colors.primary,
    },
});
