import { View, Text, StyleSheet, useColorScheme, Image, TextInput, TouchableOpacity, ScrollView, Animated, Dimensions } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useState, useEffect, useRef } from 'react';
import { Svg, Rect } from 'react-native-svg';
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

// Función para calcular el nivel basado en puntos
const calculateLevel = (points: number): number => {
  let level = 1;
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
  const gradientColors: [string, string, string] = isDark
    ? ['#2D2F36', '#3A3D45', '#484C55']
    : ['#F2ECE6', '#E7DFD6', '#DDD2C4'];
  
  const { tasks, completedTasks, petName, setPetName } = useTasks();
  const { points } = usePoints();
  
  // Calcular estadísticas de tareas
  const totalTasks = tasks.length;
  const completedCount = tasks.filter((task: Task) => task.completed).length;
  const dailyProgress = totalTasks > 0 ? completedCount / totalTasks : 0;
  
  // Calcular nivel y estado del ajolote
  const level = calculateLevel(points);
  const petState = getPetState(level);
  const levelProgress = calculateLevelProgress(points, level);
  
  // Calcular puntos para el siguiente nivel
  const currentLevelPoints = LEVELS[level - 1] || 0;
  const nextLevelPoints = LEVELS[level] || LEVELS[LEVELS.length - 1];
  const pointsToNext = nextLevelPoints - points;
  
  // Estados para edición de nombre
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(petName);

  // Estados para slides de progreso
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const { width: screenWidth } = Dimensions.get('window');
  
  // Determinar qué slides mostrar
  const slides = [];
  
  // Slide 1: Progreso de tareas (siempre visible)
  slides.push({
    id: 'tasks',
    title: '📊 Progreso de Tareas',
    content: 'tasks'
  });
  
  // Slide 2: Evolución (solo si tiene progreso significativo)
  if (level < LEVELS.length && levelProgress > 0.1) {
    slides.push({
      id: 'evolution',
      title: '⚡ Evolución',
      content: 'evolution'
    });
  }

  // Auto-slide cada 1 minuto con loop infinito
  useEffect(() => {
    if (slides.length > 1) {
      const timer = setTimeout(() => {
        const nextSlide = (currentSlide + 1) % slides.length;
        setCurrentSlide(nextSlide);
      }, 60000); // 1 minuto = 60,000 milisegundos
      return () => clearTimeout(timer);
    }
  }, [currentSlide, slides.length]);

  // Scroll automático cuando cambia el slide
  useEffect(() => {
    if (scrollViewRef.current && slides.length > 1) {
      scrollViewRef.current.scrollTo({
        x: currentSlide * screenWidth,
        animated: true,
      });
    }
  }, [currentSlide, screenWidth]);

  // Guardar nombre cuando cambia
  useEffect(() => {
    AsyncStorage.setItem(PET_NAME_KEY, petName);
  }, [petName]);

  // Función para renderizar el slide de progreso de tareas
  const renderTasksSlide = () => (
    <View style={[styles.slideBox, { 
      backgroundColor: palette.cardWarm, 
      shadowColor: isDark ? '#000' : '#B08B5E',
      shadowOffset: { width: 0, height: 2 }, 
      shadowOpacity: 0.15, 
      shadowRadius: 4,
      borderWidth: 1.5,
      borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(176,139,94,0.15)',
    }]}>
      <Text style={[styles.evolutionTitle, { color: palette.primary }]}>📊 Progreso de Tareas</Text>
      <View style={styles.progressBarContainer}>
        <Svg width="75%" height={14} viewBox="0 0 200 14">
          <Rect x={0} y={0} width={200} height={14} rx={7} fill={palette.cardAccent} />
          <Rect
            x={0}
            y={0}
            width={200 * dailyProgress}
            height={14}
            rx={7}
            fill={palette.primary}
          />
        </Svg>
        <View style={styles.progressTextContainer}>
          <Text style={[styles.progressText, { color: palette.text }]}>
            {`${completedCount}/${totalTasks} tareas`}
          </Text>
        </View>
      </View>
    </View>
  );

  // Función para renderizar el slide de evolución
  const renderEvolutionSlide = () => (
    <View style={[styles.slideBox, { 
      backgroundColor: palette.cardWarm, 
      shadowColor: isDark ? '#000' : '#B08B5E',
      shadowOffset: { width: 0, height: 2 }, 
      shadowOpacity: 0.15, 
      shadowRadius: 4,
      borderWidth: 1.5,
      borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(176,139,94,0.15)',
    }]}>
      <Text style={[styles.evolutionTitle, { color: palette.primary }]}>⚡ Evolución</Text>
      <View style={styles.progressBarContainer}>
        <Svg width="75%" height={14} viewBox="0 0 200 14">
          <Rect x={0} y={0} width={200} height={14} rx={7} fill={palette.cardAccent} />
          <Rect
            x={0}
            y={0}
            width={200 * levelProgress}
            height={14}
            rx={7}
            fill={palette.accent}
          />
        </Svg>
        <View style={styles.progressTextContainer}>
          <Text style={[styles.progressText, { color: palette.text }]}>
            {`${Math.round(levelProgress * 100)}%`}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: palette.background }] }>
      <LinearGradient
        colors={gradientColors}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
      <ScrollView 
        style={{ flex: 1 }} 
        contentContainerStyle={{ paddingTop: 60, paddingHorizontal: 20, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
      {/* Nombre editable como título grande, centrado y color accent */}
      <View style={{ alignItems: 'center', marginBottom: 8 }}>
        {editingName ? (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TextInput
              value={tempName}
              onChangeText={setTempName}
              style={{
                fontFamily: 'Nunito-Bold',
                fontSize: 34,
                color: palette.accent,
                backgroundColor: 'transparent',
                borderBottomWidth: 2,
                borderColor: palette.accent,
                textAlign: 'center',
                width: 200,
                marginRight: 8,
                marginBottom: 8,
              }}
              maxLength={16}
              autoFocus
              onSubmitEditing={() => {
                setPetName(tempName);
                setEditingName(false);
              }}
              onBlur={() => {
                setPetName(tempName);
                setEditingName(false);
              }}
              returnKeyType="done"
            />
            <TouchableOpacity onPress={() => { setPetName(tempName); setEditingName(false); }}>
              <Text style={{ color: palette.accent, fontWeight: 'bold', fontSize: 22 }}>OK</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={() => { setTempName(petName); setEditingName(true); }} style={{ alignSelf: 'center' }}>
            <Text style={{
              fontFamily: 'Nunito-Bold',
              fontSize: 34,
              color: palette.primary,
              fontWeight: 'bold',
              marginBottom: 4,
              textAlign: 'center',
            }}>{petName}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Imagen del ajolote */}
      <View style={[{ alignItems: 'center', marginBottom: 8 }]}>
        <View style={[styles.petImageContainer, {
          backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
          shadowColor: 'transparent',
        }]}
        >
          <Image source={petState.img} style={styles.petImage} resizeMode="contain" />
        </View>
      </View>
      {/* Estado y información del ajolote */}
      <View style={{ alignItems: 'center', marginBottom: 16 }}>
        {/* Estado de ánimo */}
        <View style={{ 
          backgroundColor: palette.cardWarm, 
          borderRadius: 14, 
          paddingVertical: 8, 
          paddingHorizontal: 20, 
          marginBottom: 12, 
          shadowColor: isDark ? '#000' : '#B08B5E',
          shadowOffset: { width: 0, height: 2 }, 
          shadowOpacity: 0.15, 
          shadowRadius: 4,
          borderWidth: 1.5,
          borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(176,139,94,0.15)',
        }}>
          <Text style={{ fontFamily: 'Nunito-Bold', fontSize: 16, color: palette.primary, textAlign: 'center' }}>
            {petState.emoji} {petState.mood}
          </Text>
        </View>
        
        {/* Nivel y puntos */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20, marginBottom: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={{ fontSize: 20 }}>🌱</Text>
            <Text style={{ fontFamily: 'Nunito-Bold', fontSize: 18, color: palette.primary, fontWeight: 'bold' }}>
              Nivel {level}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={{ fontSize: 18 }}>⭐</Text>
            <Text style={{ fontFamily: 'Nunito-Bold', fontSize: 16, color: palette.textSecondary, fontWeight: 'bold' }}>
              {points} pts
            </Text>
          </View>
        </View>
        
        {/* Puntos para siguiente nivel - solo si está cerca */}
        {level < LEVELS.length && levelProgress > 0.3 && (
          <Text style={{ fontSize: 14, color: palette.textSecondary, textAlign: 'center' }}>
            {pointsToNext > 0 ? `¡Solo ${pointsToNext} puntos más!` : '¡Nivel máximo!'}
          </Text>
        )}
      </View>

      {/* Sistema de slides para progreso */}
      <View style={styles.slidesContainer}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onMomentumScrollEnd={(event) => {
            const offsetX = event.nativeEvent.contentOffset.x;
            let newIndex = Math.round(offsetX / screenWidth);
            
            // Si intenta ir más allá del último slide, volver al primero
            if (newIndex >= slides.length) {
              newIndex = 0;
              // Scroll inmediato al primer slide sin animación
              if (scrollViewRef.current) {
                setTimeout(() => {
                  scrollViewRef.current?.scrollTo({ x: 0, animated: false });
                }, 50);
              }
            }
            // Si intenta ir antes del primer slide, ir al último
            else if (newIndex < 0) {
              newIndex = slides.length - 1;
              // Scroll inmediato al último slide sin animación
              if (scrollViewRef.current) {
                setTimeout(() => {
                  scrollViewRef.current?.scrollTo({ 
                    x: (slides.length - 1) * screenWidth, 
                    animated: false 
                  });
                }, 50);
              }
            }
            
            setCurrentSlide(newIndex);
          }}
          style={styles.slidesScrollView}
        >
          {slides.map((slide, index) => (
            <View key={slide.id} style={[styles.slideContainer, { width: screenWidth }]}>
              {slide.content === 'tasks' ? renderTasksSlide() : renderEvolutionSlide()}
            </View>
          ))}
        </ScrollView>

        {/* Pagination dots - solo si hay más de un slide */}
        {slides.length > 1 && (
          <View style={styles.paginationContainer}>
            {slides.map((_, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.paginationDot,
                  {
                    backgroundColor: index === currentSlide ? palette.primary : palette.textSecondary,
                    opacity: index === currentSlide ? 1 : 0.3,
                  },
                ]}
                onPress={() => {
                  setCurrentSlide(index);
                  if (scrollViewRef.current) {
                    scrollViewRef.current.scrollTo({
                      x: index * screenWidth,
                      animated: true,
                    });
                  }
                }}
              />
            ))}
          </View>
        )}
      </View>

      {/* Mensaje motivacional dinámico */}
      <View style={styles.messageContainer}>
        <Text style={[styles.motivationalMessage, {
          color: palette.textSecondary,
        }]}>
          {petState.message}
        </Text>
      </View>


      </ScrollView>
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
    borderRadius: 100,
    padding: 18,
    marginBottom: '1.5%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 4,
  },
  petImage: {
    width: 120,
    height: 120,
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
    fontSize: 14,
    marginBottom: 4,
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
    marginBottom: '3%',
  },
  slidesScrollView: {
    height: 70,
  },
  slideContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  slideBox: {
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    width: '90%',
    maxWidth: 260,
    minHeight: 55,
    alignSelf: 'center',
  },
  progressBarContainer: {
    width: '100%',
    marginTop: '2%',
    marginBottom: '1%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
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
    fontSize: 10,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '2%',
    paddingVertical: '1%',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  messageContainer: {
    alignItems: 'center',
    marginTop: '4%',
    marginBottom: '6%',
    paddingHorizontal: '8%',
  },
  motivationalMessage: {
    fontFamily: 'Nunito',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },
}); 