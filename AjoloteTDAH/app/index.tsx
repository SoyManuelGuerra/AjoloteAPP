import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { router } from "expo-router";
import { useEffect, useRef } from "react";
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from "react-native";
import { Colors } from '../constants/Colors';

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

  const isDark = systemColorScheme === 'dark';
  const palette = isDark ? Colors.dark : Colors;
  const gradientColors: [string, string, string] = isDark
    ? ['#2D2F36', '#3A3D45', '#484C55']
    : ['#F2ECE6', '#E7DFD6', '#DDD2C4'];

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
      router.replace("/welcome");
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
      <Animated.Image
        source={require("../assets/images/axofi-logo-v1.png")}
        style={[
          styles.logo,
          {
            opacity: logoAnim,
            transform: [{ scale: logoAnim }],
          },
        ]}
        resizeMode="contain"
      />
      <Text style={[styles.title, { color: palette.text }, isDark && { textShadowColor: 'rgba(0,0,0,0.25)' } ]}>Axofi</Text>
      <Text style={[styles.subtitle, { color: palette.textSecondary } ]}>
        Tu espacio, tu ritmo, sin distracciones.
      </Text>
      <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: palette.primary }]}
          onPress={handleButtonPress}
          activeOpacity={0.8}
        >
          <Text style={[styles.buttonText, { color: palette.onPrimary } ]}>¡Comenzar!</Text>
        </TouchableOpacity>
      </Animated.View>
      <Text style={[styles.footer, { color: palette.textSecondary } ]}>Toca comenzar y conoce tu nuevo compañero</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  },
  title: {
    fontFamily: "Nunito-Bold",
    fontSize: 38,
    fontWeight: "700",
    marginBottom: 10,
    letterSpacing: 1.2,
    textAlign: "center",
    textShadowColor: 'rgba(0,0,0,0.08)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontFamily: "Nunito",
    fontSize: 20,
    marginBottom: 44,
    textAlign: "center",
    lineHeight: 28,
  },
  button: {
    paddingVertical: 22,
    paddingHorizontal: 56,
    borderRadius: 24,
    elevation: 6,
    marginBottom: 28,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  buttonText: {
    fontFamily: "Nunito-Bold",
    fontWeight: "700",
    fontSize: 22,
    letterSpacing: 1.1,
  },
  footer: {
    fontFamily: "Nunito",
    fontSize: 14,
    position: "absolute",
    bottom: 24,
    textAlign: "center",
    width: "100%",
    letterSpacing: 0.5,
  },
}); 