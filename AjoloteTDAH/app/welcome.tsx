import { View, Text, StyleSheet, useColorScheme, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRef, useEffect, useState } from 'react';
import { router } from 'expo-router';
import { Colors } from '../constants/Colors';

export default function ExploreScreen() {
  const systemColorScheme = useColorScheme();
  const isDark = systemColorScheme === 'dark';
  const palette = isDark ? Colors.dark : Colors;
  const gradientColors: [string, string, string] = isDark
    ? ['#2D2F36', '#3A3D45', '#484C55']
    : ['#F2ECE6', '#E7DFD6', '#DDD2C4'];
  const buttonScale = useRef(new Animated.Value(1)).current;

  // Animación para el título
  const titleScale = useRef(new Animated.Value(0.7)).current;
  useEffect(() => {
    Animated.sequence([
      Animated.spring(titleScale, {
        toValue: 1.15,
        friction: 2,
        useNativeDriver: true,
      }),
      Animated.spring(titleScale, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Animaciones para los mensajes
  const msg1Opacity = useRef(new Animated.Value(0)).current;
  const msg2Opacity = useRef(new Animated.Value(0)).current;
  const msg3Opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(msg1Opacity, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(msg2Opacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start(() => {
        Animated.timing(msg3Opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }).start();
      });
    });
  }, []);

  const handleNextPress = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      router.push('/ChooseAccess');
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: palette.background }] }>
      <LinearGradient
        colors={gradientColors}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
      <Animated.Text
        style={[
          styles.title,
          { color: palette.text },
          { fontWeight: 'bold' },
          { transform: [{ scale: titleScale }] },
          systemColorScheme === 'dark' && { textShadowColor: 'rgba(0,0,0,0.25)' }
        ]}
      >
        ¡Bienvenido!
      </Animated.Text>
      <View style={styles.messageBlock}>
        <Animated.Text style={[styles.message, { color: palette.text }, { opacity: msg1Opacity } ]}>
          📝 Organiza tus tareas de forma simple y divertida.
        </Animated.Text>
        <Animated.Text style={[styles.message, { color: palette.text }, { opacity: msg2Opacity } ]}>
          🦎 Tu ajolote evoluciona cuando completas tareas.
        </Animated.Text>
        <Animated.Text style={[styles.message, { color: palette.text }, { opacity: msg3Opacity } ]}>
          🎨 Personalizalo, desbloquea accesorios y crea hábitos.
        </Animated.Text>
      </View>
      <Animated.View style={{ transform: [{ scale: buttonScale }], marginTop: 40, opacity: 1 }}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: palette.primary }]}
          onPress={handleNextPress}
          activeOpacity={0.8}
        >
          <Text style={[styles.buttonText, { color: palette.onPrimary } ]}>Siguiente</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  title: {
    fontFamily: 'Nunito-Bold',
    fontSize: 32,
    marginBottom: 32,
    textAlign: 'center',
    letterSpacing: 1.1,
  },
  messageBlock: {
    gap: 24,
    width: '100%',
    alignItems: 'center',
  },
  message: {
    fontFamily: 'Nunito',
    fontSize: 20,
    textAlign: 'center',
    lineHeight: 30,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 18,
    width: '100%',
    maxWidth: 400,
  },
  button: {
    paddingVertical: 22,
    paddingHorizontal: 56,
    borderRadius: 24,
    elevation: 6,
    marginBottom: 0,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: "Nunito-Bold",
    fontWeight: "700",
    fontSize: 22,
    letterSpacing: 1.1,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 24,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  backButtonText: {
    fontSize: 22,
    color: '#305252',
    fontWeight: 'bold',
  },
});
