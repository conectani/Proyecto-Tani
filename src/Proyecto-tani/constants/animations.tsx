/**
 * AnimatedButton — Botón con animación de escala spring al presionar
 * Úsalo para reemplazar TouchableOpacity en botones principales
 */
import React, { useRef } from 'react';
import {
  Animated,
  TouchableOpacity,
  TouchableOpacityProps,
  StyleProp,
  ViewStyle,
} from 'react-native';

interface AnimatedButtonProps extends TouchableOpacityProps {
  containerStyle?: StyleProp<ViewStyle>;
  scaleValue?: number;
}

export function AnimatedButton({
  children,
  containerStyle,
  style,
  onPress,
  scaleValue = 0.95,
  disabled,
  ...rest
}: AnimatedButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const animIn = () => {
    Animated.spring(scale, {
      toValue: scaleValue,
      useNativeDriver: true,
      speed: 60,
      bounciness: 2,
    }).start();
  };

  const animOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 4,
    }).start();
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={animIn}
      onPressOut={animOut}
      activeOpacity={1}
      disabled={disabled}
      {...rest}
    >
      <Animated.View
        style={[containerStyle ?? style, { transform: [{ scale }] }]}
      >
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
}

/**
 * usePulse — Hook para animación de pulso en badges/puntos de notificación
 */
export function usePulse(speed: number = 900) {
  const pulse = useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.5,
          duration: speed,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: speed,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return pulse;
}

/**
 * useFadeIn — Hook para fade-in al montar un componente
 */
export function useFadeIn(delay: number = 0, duration: number = 400) {
  const opacity = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration,
      delay,
      useNativeDriver: true,
    }).start();
  }, []);

  return opacity;
}

/**
 * useSlideIn — Hook para slide-in desde abajo al montar
 */
export function useSlideIn(delay: number = 0) {
  const translateY = useRef(new Animated.Value(24)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        delay,
        useNativeDriver: true,
        speed: 20,
        bounciness: 4,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return { translateY, opacity };
}
