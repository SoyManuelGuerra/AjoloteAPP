import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { router } from "expo-router";
import { useEffect, useRef } from "react";

export default function HomeScreen() {
  const logoAnim = useRef(new Animated.Value(0)).current;

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

  return (
    <View style={styles.container}>
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
      <Text style={styles.title}>Axofi</Text>
      <Text style={styles.subtitle}>
        Organización simple, motivación real.
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace("/(tabs)/explore")}
      >
        <Text style={styles.buttonText}>¡Comenzar!</Text>
      </TouchableOpacity>
      <Text style={styles.footer}>Tu espacio, tu ritmo, sin distracciones.</Text>
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
    width: 128,
    height: 128,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 8,
    backgroundColor: '#fff',
    borderRadius: 32,
    padding: 8,
  },
  title: {
    fontFamily: "Nunito-Bold",
    fontSize: 38,
    fontWeight: "700",
    color: "#305252",
    marginBottom: 10,
    letterSpacing: 1.2,
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
    paddingVertical: 18,
    paddingHorizontal: 56,
    borderRadius: 18,
    elevation: 4,
    marginBottom: 28,
    shadowColor: '#f78fc7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
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
    fontSize: 15,
    color: "#a5bab9",
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
});