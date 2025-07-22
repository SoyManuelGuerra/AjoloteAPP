import { View, Text, StyleSheet, useColorScheme, FlatList, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/Colors';
import { usePoints } from '../../context/PointsContext';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuración de niveles
const LEVELS = [0, 100, 250, 500, 1000]; // Puedes ajustar estos valores

// Accesorios de ejemplo para el MVP
const ACCESSORIES = [
  { id: 'hat', name: 'Gorro', cost: 50 },
  { id: 'glasses', name: 'Gafas', cost: 80 },
  { id: 'color', name: 'Color especial', cost: 120 },
];

const UNLOCKED_KEY = 'ajolote_unlocked_accessories';

export default function RewardsScreen() {
  const systemColorScheme = useColorScheme();
  const isDark = systemColorScheme === 'dark';
  const palette = isDark ? Colors.dark : Colors;
  const { points, setPoints } = usePoints();
  const [unlocked, setUnlocked] = useState<string[]>([]);

  // Leer accesorios desbloqueados al montar
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(UNLOCKED_KEY);
      if (saved) setUnlocked(JSON.parse(saved));
    })();
  }, []);

  // Guardar accesorios desbloqueados cuando cambian
  useEffect(() => {
    AsyncStorage.setItem(UNLOCKED_KEY, JSON.stringify(unlocked));
  }, [unlocked]);

  // Calcular nivel actual y progreso
  let level = 1;
  for (let i = 0; i < LEVELS.length; i++) {
    if (points >= LEVELS[i]) level = i + 1;
  }
  const nextLevelPoints = LEVELS[level] || (LEVELS[LEVELS.length - 1] + 500);
  const prevLevelPoints = LEVELS[level - 1] || 0;
  const progress = Math.min((points - prevLevelPoints) / (nextLevelPoints - prevLevelPoints), 1);

  // Manejar desbloqueo de accesorio
  const handleUnlock = (id: string, cost: number) => {
    if (points >= cost && !unlocked.includes(id)) {
      setUnlocked([...unlocked, id]);
      setPoints(points - cost);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: palette.background }] }>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 48, marginBottom: 8 }}>
        <Text style={[styles.title, { color: palette.text, marginTop: 0, marginBottom: 0 }]}>Recompensas</Text>
      </View>
      <Text style={{ color: palette.primary, fontSize: 20, marginBottom: 8 }}>Puntos: {points}</Text>
      {/* Barra de nivel */}
      <View style={styles.levelContainer}>
        <Text style={{ color: palette.text, fontSize: 16 }}>Nivel {level}</Text>
        <View style={[styles.progressBar, { backgroundColor: palette.card }] }>
          <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: palette.primary }]} />
        </View>
        <Text style={{ color: palette.textSecondary, fontSize: 12 }}>
          {points} / {nextLevelPoints} puntos para nivel {level + 1}
        </Text>
      </View>
      {/* Lista de accesorios */}
      <Text style={{ color: palette.text, fontSize: 18, marginTop: 24, marginBottom: 8 }}>Accesorios para desbloquear</Text>
      <FlatList
        data={ACCESSORIES}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          const isUnlocked = unlocked.includes(item.id);
          return (
            <View style={[styles.accessoryItem, { backgroundColor: palette.card }]}>
              <Text style={{ color: palette.text, fontSize: 16 }}>{item.name}</Text>
              <Text style={{ color: palette.textSecondary, fontSize: 14 }}>Costo: {item.cost} pts</Text>
              <TouchableOpacity
                style={[styles.unlockButton, { backgroundColor: isUnlocked ? palette.primary : palette.accent }]}
                disabled={isUnlocked || points < item.cost}
                onPress={() => handleUnlock(item.id, item.cost)}
              >
                <Text style={{ color: palette.onPrimary, fontWeight: 'bold' }}>
                  {isUnlocked ? 'Desbloqueado' : 'Desbloquear'}
                </Text>
              </TouchableOpacity>
            </View>
          );
        }}
        style={{ width: '100%' }}
        contentContainerStyle={{ alignItems: 'center', paddingBottom: 32 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingTop: 32,
  },
  title: {
    fontFamily: 'Nunito-Bold',
    fontSize: 28,
    color: Colors.text,
    marginBottom: 12,
  },
  levelContainer: {
    alignItems: 'center',
    marginBottom: 16,
    width: '90%',
    maxWidth: 400,
  },
  progressBar: {
    width: '100%',
    height: 16,
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 6,
  },
  progressFill: {
    height: '100%',
    borderRadius: 8,
  },
  accessoryItem: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 14,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  unlockButton: {
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
}); 