import { Colors } from '@/src/theme/colors';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';

export function TopoPattern() {
    return (
        <View style={StyleSheet.absoluteFill}>
            <Svg width="100%" height="100%" viewBox="0 0 412 300" preserveAspectRatio="xMidYMid slice">
                {/* Fondo base */}
                <Path d="M0 0h412v300H0z" fill={Colors.primary} />
                {/* Líneas topográficas decorativas */}
                <G opacity={0.15} stroke="#a5c5b0" strokeWidth={1.2} fill="none">
                    <Path d="M-30 180 Q80 120 160 160 Q240 200 340 140 Q400 110 450 150" />
                    <Path d="M-30 200 Q90 140 170 180 Q250 220 350 155 Q410 125 460 170" />
                    <Path d="M-30 160 Q70 100 150 140 Q230 185 330 120 Q395 90 445 135" />
                    <Path d="M-30 220 Q100 155 180 200 Q260 240 360 170 Q420 140 470 185" />
                    <Path d="M-30 140 Q60 80 140 120 Q220 165 320 100 Q385 70 440 115" />
                    <Path d="M50 260 Q130 200 210 240 Q290 280 390 215 Q440 185 490 225" />
                    <Path d="M-10 100 Q70 40 160 80 Q250 125 350 60 Q415 30 465 75" />
                    <Path d="M20 60 Q100 0 185 40 Q275 85 375 20 Q435 -10 485 35" />
                    {/* Formas cerradas / manchas topográficas */}
                    <Path d="M100 100 Q150 60 200 80 Q250 100 230 140 Q200 180 150 160 Q100 145 100 100Z" />
                    <Path d="M250 60 Q310 30 350 60 Q380 90 360 120 Q330 150 290 135 Q250 115 250 60Z" />
                    <Path d="M30 200 Q80 170 120 190 Q150 210 140 240 Q110 265 70 250 Q30 235 30 200Z" />
                    <Path d="M320 180 Q370 155 400 180 Q420 205 400 230 Q375 255 340 240 Q310 220 320 180Z" />
                </G>
                {/* Ola blanca en la parte inferior */}
                <Path
                    d="M0 180 Q60 150 120 170 Q200 195 280 165 Q350 145 412 165 L412 300 L0 300Z"
                    fill={Colors.background}
                    opacity={1}
                />
            </Svg>
        </View>
    );
}
