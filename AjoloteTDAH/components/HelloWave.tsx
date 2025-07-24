import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';

export function HelloWave() {
  // Eliminar lógica de animación y animatedStyle
  // const rotationAnimation = useSharedValue(0);

  // useEffect(() => {
  //   rotationAnimation.value = withRepeat(
  //     withSequence(withTiming(25, { duration: 150 }), withTiming(0, { duration: 150 })),
  //     4 // Run the animation 4 times
  //   );
  // }, [rotationAnimation]);

  // Eliminar lógica de animación y animatedStyle
  // const animatedStyle = useAnimatedStyle(() => ({
  //   transform: [{ rotate: `${rotationAnimation.value}deg` }],
  // }));

  return (
    <View>
      <ThemedText style={styles.text}>👋</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 28,
    lineHeight: 32,
    marginTop: -6,
  },
});
