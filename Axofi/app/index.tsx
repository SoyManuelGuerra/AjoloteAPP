import { View, Text, TouchableOpacity, StyleSheet, Animated, useColorScheme, TextInput, ScrollView } from "react-native";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const logoAnim = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const systemColorScheme = useColorScheme();
  

  
  // Estados para las presentaciones
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 4; // 3 características + pantalla final
  
  // Auto-slide con ciclo infinito
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentSlide((currentSlide + 1) % totalSlides); // Ciclo infinito
    }, 3000); // Cambia cada 3 segundos
    
    return () => clearTimeout(timer);
  }, [currentSlide, totalSlides]);

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

  const handleButtonPress = (action: string) => {
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
      switch (action) {
        case 'guest':
          router.replace("/(tabs)/tasks");
          break;
        case 'login':
          router.push('/login-screen');
          break;
        case 'register':
          router.push('/register-screen');
          break;
        case 'next':
          if (currentSlide < totalSlides - 1) {
            setCurrentSlide(currentSlide + 1);
          }
          break;
        case 'skip':
          setCurrentSlide(totalSlides - 1);
          break;
      }
    });
  };





  const renderSlide = () => {



    // Slides de presentación
    switch (currentSlide) {
      case 0:
        return (
          <View style={styles.slideContainer}>
            <View style={styles.slideContent}>
              <View style={styles.placeholderImage}>
                <Ionicons name="checkmark-circle" size={80} color={palette.primary} />
              </View>
              <Text style={[styles.slideTitle, { color: palette.text }]}>
                Organiza tus tareas
              </Text>
              <Text style={[styles.slideDescription, { color: palette.textSecondary }]}>
                De forma simple y divertida, sin distracciones
              </Text>
            </View>
          </View>
        );

      case 1:
        return (
          <View style={styles.slideContainer}>
            <View style={styles.slideContent}>
              <View style={styles.placeholderImage}>
                <Ionicons name="paw" size={80} color={palette.primary} />
              </View>
              <Text style={[styles.slideTitle, { color: palette.text }]}>
                Tu ajolote evoluciona
              </Text>
              <Text style={[styles.slideDescription, { color: palette.textSecondary }]}>
                Cuando completas tareas, tu mascota crece contigo
              </Text>
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.slideContainer}>
            <View style={styles.slideContent}>
              <View style={styles.placeholderImage}>
                <Ionicons name="color-palette" size={80} color={palette.primary} />
              </View>
              <Text style={[styles.slideTitle, { color: palette.text }]}>
                Personaliza y crea hábitos
              </Text>
              <Text style={[styles.slideDescription, { color: palette.textSecondary }]}>
                Desbloquea accesorios y construye rutinas saludables
              </Text>
            </View>
          </View>
        );

      case 3:
        return (
          <View style={styles.slideContainer}>
            <View style={styles.slideContent}>
              <View style={styles.placeholderImage}>
                <Ionicons name="star" size={80} color={palette.primary} />
              </View>
              <Text style={[styles.slideTitle, { color: palette.text }]}>
                ¡Comienza tu aventura!
              </Text>
              <Text style={[styles.slideDescription, { color: palette.textSecondary }]}>
                Tu espacio, tu ritmo, sin distracciones
              </Text>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: palette.background }]}>
      <LinearGradient
        colors={gradientColors}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
      
            {/* Contenido principal centrado */}
      <View style={styles.mainContent}>
        {renderSlide()}
        
        {/* Indicadores de paginación */}
        <View style={styles.paginationContainer}>
          {Array.from({ length: totalSlides }, (_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.paginationDot,
                {
                  backgroundColor: index === currentSlide ? palette.primary : palette.textSecondary,
                  opacity: index === currentSlide ? 1 : 0.3,
                }
              ]}
              onPress={() => setCurrentSlide(index)}
            />
          ))}
        </View>
        
        {/* Botones de acción siempre presentes */}
        <View style={styles.buttonsContainer}>
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: palette.primary }]}
              onPress={() => handleButtonPress('register')}
              activeOpacity={0.8}
            >
              <Text style={[styles.buttonText, { color: palette.onPrimary }]}>Crear Cuenta</Text>
            </TouchableOpacity>
          </Animated.View>
          
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              style={[styles.secondaryButton, { 
                borderColor: palette.accent,
                backgroundColor: isDark ? 'rgba(196, 184, 217, 0.2)' : 'rgba(168, 195, 184, 0.2)',
                borderWidth: 2
              }]}
              onPress={() => handleButtonPress('login')}
              activeOpacity={0.8}
            >
              <Text style={[styles.secondaryButtonText, { color: palette.accent, fontWeight: '600' }]}>Iniciar Sesión</Text>
            </TouchableOpacity>
          </Animated.View>
          
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              style={[styles.secondaryButton, { 
                borderColor: palette.textSecondary,
                backgroundColor: isDark ? 'rgba(174, 181, 188, 0.2)' : 'rgba(125, 132, 141, 0.2)',
                borderWidth: 2
              }]}
              onPress={() => handleButtonPress('guest')}
              activeOpacity={0.8}
            >
              <Text style={[styles.secondaryButtonText, { color: palette.textSecondary, fontWeight: '600' }]}>Continuar como Invitado</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: '8%',
    paddingTop: '10%',
    paddingBottom: '8%',
  },
  logo: {
    width: '60%',
    height: '25%',
    maxWidth: 200,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    borderRadius: 32,
    alignSelf: 'center',
  },
  title: {
    fontFamily: "Nunito-Bold",
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 16,
    letterSpacing: 1.2,
    textAlign: "center",
    textShadowColor: 'rgba(0,0,0,0.08)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontFamily: "Nunito",
    fontSize: 18,
    marginBottom: 24,
    textAlign: "center",
    lineHeight: 24,
  },
  welcomeContainer: {
    width: '100%',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
  },
  featuresContainer: {
    width: '100%',
    marginBottom: 20,
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 8,
  },
  featureText: {
    fontFamily: 'Nunito',
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  buttonsContainer: {
    width: '100%',
    gap: 16,
    marginTop: 20,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 20,
    elevation: 6,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    fontFamily: "Nunito-Bold",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 1.1,
  },
  secondaryButton: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: 'center',
    width: '100%',
  },
  secondaryButtonText: {
    fontFamily: "Nunito-Bold",
    fontWeight: "700",
    fontSize: 14,
    letterSpacing: 1.1,
  },

  slideContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  slideContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingBottom: 60, // Espacio para los indicadores de paginación
  },
  placeholderImage: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(107, 143, 113, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  slideTitle: {
    fontFamily: 'Nunito-Bold',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  slideDescription: {
    fontFamily: 'Nunito',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
    maxWidth: 300, // Limitar el ancho máximo del texto
  },

  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
    paddingVertical: 16, // Espacio adicional arriba y abajo
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
}); 