import { View, Text, StyleSheet, useColorScheme, Image, TextInput, TouchableOpacity, AppState } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useState, useEffect } from 'react';
import { Svg, Rect } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Quitar importación de Animated y hooks de reanimated
// import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTasks } from '../../context/TasksContext';
import { usePoints } from '../../context/PointsContext';
import { LinearGradient } from 'expo-linear-gradient';

const PET_STATES = [
  { mood: 'Feliz', message: '¡Tu ajolote está feliz y motivado! 🎉', img: require('../../assets/images/axofi-logo-v1.png') },
  // Aquí podrías agregar más estados y evoluciones
];

const PET_NAME_KEY = 'ajolote_name';
const LEVELS = [0, 100, 250, 500, 1000];

export default function PetScreen() {
  const systemColorScheme = useColorScheme();
  const isDark = systemColorScheme === 'dark';
  const palette = isDark ? Colors.dark : Colors;
  const gradientColors: [string, string, string] = isDark
    ? ['#2D2F36', '#3A3D45', '#484C55']
    : ['#F2ECE6', '#E7DFD6', '#DDD2C4'];
  // Simulación de estado (en el futuro, esto puede depender del progreso real)
  const [petState] = useState(PET_STATES[0]);
  const { tasks, petName, setPetName } = useTasks();
  const completedCount = tasks.filter((t: any) => t.completed).length;
  const totalCount = tasks.length;
  const progress = totalCount > 0 ? completedCount / totalCount : 0;
  const { points } = usePoints();
  // Calcular nivel actual
  let level = 1;
  for (let i = 0; i < LEVELS.length; i++) {
    if (points >= LEVELS[i]) level = i + 1;
  }
  // Nombre editable simple
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(petName);

  // Eliminar lógica de animación de flotación
  // const floatAnim = useSharedValue(0);
  // useEffect(() => {
  //   floatAnim.value = withRepeat(
  //     withSequence(
  //       withTiming(-10, { duration: 1200 }),
  //       withTiming(0, { duration: 1200 })
  //     ),
  //     -1,
  //     true
  //   );
  // }, []);
  // const floatStyle = useAnimatedStyle(() => ({
  //   transform: [{ translateY: floatAnim.value }],
  // }));

  // Elimina el useEffect que leía tareas de AsyncStorage y el estado local de tasks

  // Guardar nombre cuando cambia
  useEffect(() => {
    AsyncStorage.setItem(PET_NAME_KEY, petName);
  }, [petName]);

  return (
    <View style={[styles.container, { backgroundColor: palette.background }] }>
      <LinearGradient
        colors={gradientColors}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
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
      {/* Estado de ánimo encima del nivel y puntos */}
      <View style={{ alignItems: 'center', marginBottom: 8 }}>
        <View style={{ 
          backgroundColor: palette.cardWarm, 
          borderRadius: 14, 
          paddingVertical: 6, 
          paddingHorizontal: 18, 
          marginBottom: 8, 
          shadowColor: isDark ? '#000' : '#B08B5E',
          shadowOffset: { width: 0, height: 2 }, 
          shadowOpacity: 0.15, 
          shadowRadius: 4,
          borderWidth: 1.5,
          borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(176,139,94,0.15)',
        }}>
          <Text style={{ fontFamily: 'Nunito-Bold', fontSize: 16, color: palette.primary, textAlign: 'center' }}>{petState.mood} {petState.mood === 'Feliz' ? '😊' : ''}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 }}>
          <Text style={{ fontSize: 20, marginRight: 2 }}>🌱</Text>
          <Text style={{ fontFamily: 'Nunito-Bold', fontSize: 18, color: palette.primary, fontWeight: 'bold' }}>Nivel {level}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 }}>
          <Text style={{ fontSize: 18, marginRight: 2 }}>⭐</Text>
          <Text style={{ fontFamily: 'Nunito-Bold', fontSize: 16, color: palette.textSecondary, fontWeight: 'bold' }}>Puntos: {points}</Text>
        </View>
      </View>

      {/* Barra de evolución */}
      <View style={[styles.progressBox, { 
        backgroundColor: palette.cardWarm, 
        shadowColor: isDark ? '#000' : '#B08B5E',
        shadowOffset: { width: 0, height: 2 }, 
        shadowOpacity: 0.15, 
        shadowRadius: 4,
        borderWidth: 1.5,
        borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(176,139,94,0.15)',
      }] }>
        <Text style={[styles.evolutionTitle, { color: palette.primary }]}>Evolución diaria</Text>
        {/* Barra de progreso visual */}
        <View style={{ width: 220, height: 24, marginTop: 8, marginBottom: 4, justifyContent: 'center', position: 'relative' }}>
          {/* Fondo de la barra */}
          <Svg width={220} height={24}>
            <Rect x={0} y={0} width={220} height={24} rx={12} fill={palette.cardAccent} />
            {/* Barra de progreso */}
            <Rect
              x={0}
              y={0}
              width={220 * progress}
              height={24}
              rx={12}
              fill={palette.primary}
            />
          </Svg>
          {/* Texto de progreso centrado */}
          <View style={{ position: 'absolute', left: 0, top: 0, width: 220, height: 24, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: palette.text, fontWeight: 'bold', fontSize: 13 }}>
              {`${completedCount}/${totalCount}`}
            </Text>
          </View>
        </View>
      </View>

      {/* Mensaje motivacional */}
      <Text style={{
        fontFamily: 'Nunito',
        fontSize: 16,
        color: palette.textSecondary,
        textAlign: 'center',
        marginTop: 18,
        marginBottom: 18,
        maxWidth: 320,
        alignSelf: 'center',
      }}>
        ¡Completa tus tareas para que tu ajolote evolucione!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  title: {
    fontFamily: 'Nunito-Bold',
    fontSize: 32,
    marginBottom: 16,
    letterSpacing: 1.1,
  },
  petImageContainer: {
    backgroundColor: '#fff',
    borderRadius: 100,
    padding: 18,
    marginBottom: 12,
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
    marginBottom: 6,
  },
  message: {
    fontFamily: 'Nunito',
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
    maxWidth: 320,
  },
  evolutionBox: {
    backgroundColor: '#F5F5F7',
    borderRadius: 18,
    padding: 18,
    marginTop: 18,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
  },
  evolutionTitle: {
    fontFamily: 'Nunito-Bold',
    fontSize: 18,
    marginBottom: 6,
  },
  evolutionText: {
    fontFamily: 'Nunito',
    fontSize: 15,
    textAlign: 'center',
  },
  progressBox: {
    backgroundColor: Colors.card,
    borderRadius: 18,
    padding: 18,
    marginTop: 18,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
}); 