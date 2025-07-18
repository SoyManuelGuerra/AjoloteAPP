import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { router } from "expo-router";
import { useEffect, useRef } from "react";
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from "react-native";

export default function HomeScreen() {
  const logoAnim = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const systemColorScheme = useColorScheme();

  useEffect(() => {
    Animated.sequence([
      Animated.timing(logoAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(logoAnim, {
        toValue: 1.1,
        friction: 2,
        useNativeDriver: true,
      }),
      Animated.spring(logoAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const gradientColors: [string, string] = systemColorScheme === 'dark'
    ? ['#305252', '#4C5B61']
    : ['#F4F8FB', '#B9E9F7'];

  const handleButtonPress = () => {
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
      router.replace("/(tabs)/explore");
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
      <Animated.Image
        source={require("../../assets/images/axofi-logo-v1.png")}
        style={[
          styles.logo,
          {
            opacity: logoAnim,
            transform: [{ scale: logoAnim }],
          },
        ]}
        resizeMode="contain"
      />
      <Text style={[styles.title, systemColorScheme === 'dark' && { color: '#F4F8FB', textShadowColor: 'rgba(0,0,0,0.25)' } ]}>Axofi</Text>
      <Text style={[styles.subtitle, systemColorScheme === 'dark' && { color: '#B9E9F7' } ]}>
      Tu espacio, tu ritmo, sin distracciones.
      </Text>
      <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleButtonPress}
          activeOpacity={0.8}
        >
          <Text style={[styles.buttonText, systemColorScheme === 'dark' && { color: '#305252' } ]}>¡Comenzar!</Text>
        </TouchableOpacity>
      </Animated.View>
      <Text style={[styles.footer, systemColorScheme === 'dark' && { color: '#B9E9F7' } ]}>Toca comenzar y conoce tu nuevo compañero</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F4F8FB",
    padding: 32,
  },
  logo: {
    width: 280,
    height: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    borderRadius: 32,
    // padding: 8, // Eliminado para mejor alineación
  },
  title: {
    fontFamily: "Nunito-Bold",
    fontSize: 38,
    fontWeight: "700",
    color: "#305252",
    marginBottom: 10,
    letterSpacing: 1.2,
    textAlign: "center", // Agregado para centrar el texto
    textShadowColor: 'rgba(0,0,0,0.08)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontFamily: "Nunito",
    fontSize: 20,
    color: "#588686",
    marginBottom: 44,
    textAlign: "center",
    lineHeight: 28,
  },
  button: {
    backgroundColor: "#f78fc7",
    paddingVertical: 22,
    paddingHorizontal: 56,
    borderRadius: 24,
    elevation: 6,
    marginBottom: 28,
    shadowColor: '#f78fc7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  buttonText: {
    fontFamily: "Nunito-Bold",
    color: "#fff",
    fontWeight: "700",
    fontSize: 22,
    letterSpacing: 1.1,
  },
  footer: {
    fontFamily: "Nunito",
    fontSize: 14,
    color: "#588686",
    position: "absolute",
    bottom: 24,
    textAlign: "center",
    width: "100%",
    letterSpacing: 0.5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 28,
  },
  menuButton: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: 18,
    elevation: 4,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    alignItems: 'center',
  },
  menuButtonInicio: {
    backgroundColor: '#B9E9F7', // Celeste Claro
  },
  menuButtonExplorar: {
    backgroundColor: '#F8B7D8', // Rosa Pastel
  },
  menuButtonText: {
    fontFamily: 'Nunito-Bold',
    color: '#305252', // Azul Grisáceo
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 1.1,
  },
  themeToggle: {
    position: 'absolute',
    top: 40,
    right: 24,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  themeToggleText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 14,
    color: '#305252',
  },
});