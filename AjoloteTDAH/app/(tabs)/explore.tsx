import { View, Text, StyleSheet, useColorScheme, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRef } from 'react';

export default function ExploreScreen() {
  const systemColorScheme = useColorScheme();
  const gradientColors: [string, string] = systemColorScheme === 'dark'
    ? ['#305252', '#4C5B61']
    : ['#F4F8FB', '#B9E9F7'];
  const buttonScale = useRef(new Animated.Value(1)).current;

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
      // Aquí puedes navegar a la siguiente pantalla cuando la definas
      // Por ahora solo feedback visual
    });
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={gradientColors}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <Text style={[styles.title, systemColorScheme === 'dark' && { color: '#F4F8FB' }]}>¡Bienvenido!</Text>
      <View style={styles.messageBlock}>
        <Text style={[styles.message, systemColorScheme === 'dark' && { color: '#B9E9F7', backgroundColor: 'rgba(48,82,82,0.18)' }]}>📝 Organizá tus tareas de forma simple y divertida.</Text>
        <Text style={[styles.message, systemColorScheme === 'dark' && { color: '#B9E9F7', backgroundColor: 'rgba(48,82,82,0.18)' }]}>🦎 Tu ajolote evoluciona cuando completas tareas.</Text>
        <Text style={[styles.message, systemColorScheme === 'dark' && { color: '#B9E9F7', backgroundColor: 'rgba(48,82,82,0.18)' }]}>🎨 Personalizalo, desbloqueá accesorios y creá hábitos.</Text>
      </View>
      <Animated.View style={{ transform: [{ scale: buttonScale }], marginTop: 40 }}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleNextPress}
          activeOpacity={0.8}
        >
          <Text style={[styles.buttonText, systemColorScheme === 'dark' && { color: '#305252' } ]}>Siguiente</Text>
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
    backgroundColor: '#F4F8FB',
    padding: 32,
  },
  title: {
    fontFamily: 'Nunito-Bold',
    fontSize: 32,
    color: '#305252',
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
    color: '#588686',
    textAlign: 'center',
    lineHeight: 30,
    backgroundColor: 'rgba(185,233,247,0.18)',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 18,
    width: '100%',
    maxWidth: 400,
  },
  button: {
    backgroundColor: "#f78fc7",
    paddingVertical: 22,
    paddingHorizontal: 56,
    borderRadius: 24,
    elevation: 6,
    marginBottom: 0,
    shadowColor: '#f78fc7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: "Nunito-Bold",
    color: "#fff",
    fontWeight: "700",
    fontSize: 22,
    letterSpacing: 1.1,
  },
});
