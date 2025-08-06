import { View, Text, StyleSheet, useColorScheme, Image, TextInput, TouchableOpacity, ScrollView, Animated, Dimensions } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Svg, Rect, Circle } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useTasks, Task } from '../../context/TasksContext';
import { usePoints } from '../../context/PointsContext';
import { LinearGradient } from 'expo-linear-gradient';

const PET_STATES = [
  { level: 1, mood: 'Curioso', message: '¡Tu ajolote está explorando y aprendiendo! 🔍', emoji: '🤔', img: require('../../assets/images/axofi_feliz_app.png') },
  { level: 2, mood: 'Feliz', message: '¡Tu ajolote está feliz y motivado! 🎉', emoji: '😊', img: require('../../assets/images/axofi_feliz_app.png') },
  { level: 3, mood: 'Energético', message: '¡Tu ajolote rebosa de energía! ⚡', emoji: '🤩', img: require('../../assets/images/axofi_feliz_app.png') },
  { level: 4, mood: 'Sabio', message: '¡Tu ajolote ha ganado mucha experiencia! 🧠', emoji: '🤓', img: require('../../assets/images/axofi_feliz_app.png') },
  { level: 5, mood: 'Legendario', message: '¡Tu ajolote es una leyenda! 👑', emoji: '👑', img: require('../../assets/images/axofi_feliz_app.png') },
];

const PET_NAME_KEY = 'ajolote_name';
const LEVELS = [0, 100, 250, 500, 1000, 2000];
// Auto-slide removido para evitar problemas de alineación
const MIN_EVOLUTION_PROGRESS = 0.1;
const MIN_LEVEL_PROGRESS_SHOW = 0.3;

// Función para calcular el nivel basado en puntos
const calculateLevel = (points: number): number => {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (points >= LEVELS[i]) {
      return Math.min(i + 1, PET_STATES.length);
    }
  }
  return 1;
};

// Función para obtener el estado del ajolote basado en el nivel
const getPetState = (level: number) => {
  return PET_STATES[level - 1] || PET_STATES[0];
};

// Función para calcular progreso hacia el siguiente nivel
const calculateLevelProgress = (points: number, level: number) => {
  if (level >= LEVELS.length) return 1; // Nivel máximo alcanzado
  
  const currentLevelPoints = LEVELS[level - 1];
  const nextLevelPoints = LEVELS[level];
  const progressPoints = points - currentLevelPoints;
  const totalPoints = nextLevelPoints - currentLevelPoints;
  
  return Math.min(progressPoints / totalPoints, 1);
};

export default function PetScreen() {
  const systemColorScheme = useColorScheme();
  const isDark = systemColorScheme === 'dark';
  const palette = isDark ? Colors.dark : Colors;
  const gradientColors: [string, string, string] = useMemo(() => 
    isDark
      ? ['#2D2F36', '#3A3D45', '#484C55']
      : ['#F2ECE6', '#E7DFD6', '#DDD2C4'],
    [isDark]
  );
  
  const { tasks, completedTasks, petName, setPetName } = useTasks();
  const { points } = usePoints();
  
  // Estados para edición de nombre
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(petName);

  // Slides removidos para simplificar la pantalla
  
  // Animaciones
  const petImageScale = useRef(new Animated.Value(1)).current;
  const moodCardOpacity = useRef(new Animated.Value(0)).current;
  const progressBarWidth = useRef(new Animated.Value(0)).current;
  
  // Memoizar cálculos costosos
  const petStats = useMemo(() => {
    const totalTasks = tasks.length;
    const completedCount = tasks.filter((task: Task) => task.completed).length;
    const dailyProgress = totalTasks > 0 ? completedCount / totalTasks : 0;
    const level = calculateLevel(points);
    const petState = getPetState(level);
    const levelProgress = calculateLevelProgress(points, level);
    const currentLevelPoints = LEVELS[level - 1] || 0;
    const nextLevelPoints = LEVELS[level] || LEVELS[LEVELS.length - 1];
    const pointsToNext = nextLevelPoints - points;
    
    return {
      totalTasks,
      completedCount,
      dailyProgress,
      level,
      petState,
      levelProgress,
      pointsToNext
    };
  }, [tasks, points]);

  // Slides removidos para simplificar la pantalla

  // Animaciones al cargar
  useEffect(() => {
    // Animación de entrada del pet
    Animated.sequence([
      Animated.timing(petImageScale, {
        toValue: 1.1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(petImageScale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Animación de la tarjeta de estado de ánimo
    Animated.timing(moodCardOpacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Animación de la barra de progreso
    Animated.timing(progressBarWidth, {
      toValue: 1,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, []);

  // Auto-slide removido para evitar problemas de alineación

  // Guardar nombre optimizado
  useEffect(() => {
    const saveName = async () => {
      try {
        await AsyncStorage.setItem(PET_NAME_KEY, petName);
      } catch (error) {
        console.warn('Error saving pet name:', error);
      }
    };
    saveName();
  }, [petName]);

  // Callbacks optimizados
  const handleNameEdit = useCallback(() => {
    setTempName(petName);
    setEditingName(true);
  }, [petName]);

  const handleNameSave = useCallback(() => {
    setPetName(tempName);
    setEditingName(false);
  }, [tempName, setPetName]);

  // Funciones de slides removidas para simplificar

  return (
    <View style={[styles.container, { backgroundColor: palette.background }] }>
      <LinearGradient
        colors={gradientColors}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
      <View 
        style={{ 
          flex: 1, 
          paddingTop: 60, 
          paddingHorizontal: 20, 
          paddingBottom: 20,
          justifyContent: 'space-between'
        }}
      >
      {/* Nombre editable como título grande, centrado y color accent */}
      <View style={{ alignItems: 'center', marginBottom: 16 }}>
        {editingName ? (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TextInput
              value={tempName}
              onChangeText={setTempName}
              style={{
                fontFamily: 'Nunito-Bold',
                fontSize: 32,
                color: palette.accent,
                backgroundColor: 'transparent',
                borderBottomWidth: 3,
                borderColor: palette.accent,
                textAlign: 'center',
                width: 200,
                marginRight: 12,
                marginBottom: 8,
                paddingVertical: 4,
              }}
              maxLength={16}
              autoFocus
              onSubmitEditing={handleNameSave}
              onBlur={handleNameSave}
              returnKeyType="done"
            />
            <TouchableOpacity 
              onPress={handleNameSave}
              style={{
                backgroundColor: palette.accent,
                borderRadius: 20,
                paddingHorizontal: 16,
                paddingVertical: 8,
              }}
            >
              <Text style={{ color: palette.background, fontWeight: 'bold', fontSize: 16 }}>OK</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={handleNameEdit} style={{ alignSelf: 'center' }}>
            <Text style={{
              fontFamily: 'Nunito-Bold',
              fontSize: 32,
              color: palette.primary,
              fontWeight: 'bold',
              marginBottom: 4,
              textAlign: 'center',
              textShadowColor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.5)',
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 2,
            }}>{petName}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Imagen del ajolote con animación */}
      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <Animated.View style={[
          styles.petImageContainer, 
          {
            backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
            shadowColor: isDark ? '#000' : '#B08B5E',
            shadowOffset: { width: 0, height: 8 }, 
            shadowOpacity: 0.25, 
            shadowRadius: 16,
            transform: [{ scale: petImageScale }],
          }
        ]}>
          <Image source={petStats.petState.img} style={styles.petImage} resizeMode="contain" />
        </Animated.View>
      </View>
      
      {/* Estado y información del ajolote */}
      <View style={{ alignItems: 'center', marginBottom: 16 }}>
        {/* Estado de ánimo con animación */}
        <Animated.View style={[
          styles.moodCard,
          { 
            backgroundColor: palette.cardWarm, 
            opacity: moodCardOpacity,
            shadowColor: isDark ? '#000' : '#B08B5E',
            shadowOffset: { width: 0, height: 4 }, 
            shadowOpacity: 0.2, 
            shadowRadius: 8,
            borderWidth: 1.5,
            borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(176,139,94,0.2)',
          }
        ]}>
          <Text style={{ fontFamily: 'Nunito-Bold', fontSize: 18, color: palette.primary, textAlign: 'center' }}>
            {petStats.petState.emoji} {petStats.petState.mood}
          </Text>
        </Animated.View>
        
        {/* Nivel y puntos con mejor espaciado */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={{ fontSize: 24 }}>🌱</Text>
            <Text style={{ fontFamily: 'Nunito-Bold', fontSize: 20, color: palette.primary, fontWeight: 'bold' }}>
              Nivel {petStats.level}
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={{ fontSize: 20 }}>⭐</Text>
            <Text style={{ fontFamily: 'Nunito-Bold', fontSize: 18, color: palette.textSecondary, fontWeight: 'bold' }}>
              {points} pts
            </Text>
          </View>
        </View>
        
        {/* Puntos para siguiente nivel - solo si no es nivel máximo */}
        {petStats.level < PET_STATES.length && (
          <View style={styles.nextLevelContainer}>
            <Text style={{ fontSize: 15, color: palette.textSecondary, textAlign: 'center', fontFamily: 'Nunito' }}>
              {petStats.pointsToNext > 0 ? `¡Solo ${petStats.pointsToNext} puntos más!` : '¡Nivel máximo!'}
            </Text>
          </View>
        )}
      </View>



      {/* Mensaje motivacional dinámico */}
      <View style={styles.messageContainer}>
        <Text style={[styles.motivationalMessage, {
          color: palette.textSecondary,
        }]}>
          {petStats.petState.message}
        </Text>
      </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontFamily: 'Nunito-Bold',
    fontSize: 32,
    marginBottom: '2%',
    letterSpacing: 1.1,
  },
  petImageContainer: {
    backgroundColor: '#fff',
    borderRadius: 140,
    padding: 24,
    marginBottom: '2%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  petImage: {
    width: 160,
    height: 160,
  },
  mood: {
    fontFamily: 'Nunito-Bold',
    fontSize: 22,
    marginBottom: '0.8%',
  },
  message: {
    fontFamily: 'Nunito',
    fontSize: 16,
    marginBottom: '3%',
    textAlign: 'center',
    maxWidth: 320,
  },
  evolutionBox: {
    backgroundColor: '#F5F5F7',
    borderRadius: 18,
    padding: '2.2%',
    marginTop: '2.2%',
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
  },
  evolutionTitle: {
    fontFamily: 'Nunito-Bold',
    fontSize: 16,
    marginBottom: 8,
  },
  evolutionText: {
    fontFamily: 'Nunito',
    fontSize: 15,
    textAlign: 'center',
  },
  progressBox: {
    backgroundColor: Colors.card,
    borderRadius: 18,
    padding: '2.2%',
    marginTop: '2.2%',
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  slidesContainer: {
    marginBottom: '2%',
  },
  slidesScrollView: {
    height: 100,
  },
  slideContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  slideBox: {
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
    minHeight: 80,
    alignSelf: 'center',
  },
  progressBarContainer: {
    width: '100%',
    alignItems: 'center',
  },
  progressTextContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressText: {
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '3%',
    paddingVertical: '2%',
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 6,
  },
  messageContainer: {
    alignItems: 'center',
    marginTop: '2%',
    paddingHorizontal: '8%',
  },
  motivationalMessage: {
    fontFamily: 'Nunito',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 300,
  },
  moodCard: {
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  nextLevelContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  slideHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  slideIcon: {
    fontSize: 24,
  },
  slideTitle: {
    fontFamily: 'Nunito-Bold',
    fontSize: 18,
  },
  progressBarBackground: {
    width: '100%',
    height: 18,
    borderRadius: 9,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 9,
  },
  progressBarShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '50%',
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 9,
  },
  slideContent: {
    width: '100%',
    alignItems: 'center',
  },
  progressSection: {
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
  },
  progressBarWrapper: {
    width: '100%',
    height: 20,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 8,
  },
  infoSection: {
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
  },
  infoText: {
    fontFamily: 'Nunito',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 4,
  },
  percentageText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 18,
    textAlign: 'center',
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressCard: {
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
    minHeight: 80,
    alignSelf: 'center',
  },
  progressContent: {
    width: '100%',
    alignItems: 'center',
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  progressIcon: {
    fontSize: 24,
  },
  progressTitle: {
    fontFamily: 'Nunito-Bold',
    fontSize: 18,
  },
  progressInfo: {
    width: '100%',
    alignItems: 'center',
  },
  progressPercentage: {
    fontFamily: 'Nunito-Bold',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 4,
  },
}); 