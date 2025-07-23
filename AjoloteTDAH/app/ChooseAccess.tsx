import { View, Text, StyleSheet, useColorScheme, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRef, useEffect } from 'react';
import { router } from 'expo-router';
import { Colors } from '../constants/Colors';

export default function ChooseAccess() {
  const systemColorScheme = useColorScheme();
  const isDark = systemColorScheme === 'dark';
  const palette = isDark ? Colors.dark : Colors;
  const gradientColors: [string, string, string] = isDark
    ? ['#2D2F36', '#3A3D45', '#484C55']
    : ['#F2ECE6', '#E7DFD6', '#DDD2C4'];

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

  return (
    <View style={[styles.container, { backgroundColor: palette.background }] }>
      <LinearGradient
        colors={gradientColors}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
      <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/welcome')}>
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>
      <Animated.Text
        style={[
          styles.title,
          { color: palette.text },
          { fontWeight: 'bold' },
          { transform: [{ scale: titleScale }] },
          systemColorScheme === 'dark' && { textShadowColor: 'rgba(0,0,0,0.25)' }
        ]}
      >
        ¿Cómo quieres continuar?
      </Animated.Text>
      <View style={styles.optionsBlock}>
        <TouchableOpacity style={[styles.optionButton, styles.signupButton, { backgroundColor: palette.primary, shadowColor: palette.primary }]} onPress={() => router.replace('/register')} activeOpacity={0.8}>
          <Text style={[styles.optionButtonText, { color: palette.onPrimary }]}>Registrarme</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity style={[styles.optionButton, styles.loginButton, { backgroundColor: palette.card, borderColor: palette.primary, shadowColor: palette.card }]} onPress={() => router.replace('login')} activeOpacity={0.8}>
          <Text style={[styles.optionButtonText, { color: palette.primary }]}>Ya tengo cuenta</Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          style={[
            styles.optionButton,
            styles.guestButton,
            { backgroundColor: '#A89CC8', shadowColor: '#A89CC8' }
          ]}
          onPress={() => router.replace('/(tabs)/tasks')}
          activeOpacity={0.8}
        >
          <Text style={[styles.optionButtonText, { color: palette.onPrimary }]}>Continuar como invitado</Text>
        </TouchableOpacity>
      </View>
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
  optionsBlock: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    marginTop: 8,
  },
  optionButton: {
    width: '100%',
    borderRadius: 24,
    paddingVertical: 18,
    paddingHorizontal: 56,
    marginBottom: 18,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    alignItems: 'center',
  },
  optionButtonText: {
    fontFamily: 'Nunito-Bold',
    fontWeight: '700',
    fontSize: 20,
    letterSpacing: 1.1,
  },
  signupButton: {},
  loginButton: {
    borderWidth: 2,
  },
  guestButton: {},
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