/**
 * UserAvatar — Componente global de avatar de usuario TANI
 * Usa la imagen local "Tani user icon.png" en todos los headers
 */
import React from 'react';
import { Image, StyleSheet, View, ViewStyle } from 'react-native';

const TANI_USER = require('@/assets/images/Tani user icon.png');

interface UserAvatarProps {
  size?: number;
  style?: ViewStyle;
}

export function UserAvatar({ size = 40, style }: UserAvatarProps) {
  return (
    <View
      style={[
        styles.wrap,
        { width: size, height: size, borderRadius: size / 2 },
        style,
      ]}
    >
      <Image
        source={TANI_USER}
        style={styles.img}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    overflow: 'hidden',
    backgroundColor: '#eae8e7',
  },
  img: {
    width: '100%',
    height: '100%',
  },
});

// También exportamos la referencia de imagen directamente por si se necesita
export const TANI_USER_IMG = TANI_USER;
