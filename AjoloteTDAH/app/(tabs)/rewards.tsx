import { View, Text, StyleSheet, useColorScheme, FlatList, TouchableOpacity, Animated, Dimensions, SafeAreaView, StatusBar, Platform } from 'react-native';
import { Colors } from '../../constants/Colors';
import { usePoints } from '../../context/PointsContext';
import { useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

const { width: screenWidth } = Dimensions.get('window');

// Configuración de niveles
const LEVELS = [0, 100, 250, 500, 1000];

// Accesorios agrupados por categorías
const REWARD_CATEGORIES = [
  {
    id: 'hats',
    name: 'Sombreros',
    icon: '🎩',
    accessories: [
      { id: 'hat', name: 'Gorro', cost: 50, icon: '🎩' },
      { id: 'crown', name: 'Corona', cost: 200, icon: '👑' },
      { id: 'cap', name: 'Gorra', cost: 75, icon: '🧢' },
    ]
  },
  {
    id: 'accessories',
    name: 'Accesorios',
    icon: '👓',
    accessories: [
      { id: 'glasses', name: 'Gafas', cost: 80, icon: '👓' },
      { id: 'bowtie', name: 'Moño', cost: 110, icon: '🎀' },
      { id: 'mustache', name: 'Bigote', cost: 70, icon: '🧔' },
      { id: 'earrings', name: 'Aretes', cost: 60, icon: '💎' },
    ]
  },
  {
    id: 'clothing',
    name: 'Ropa',
    icon: '👕',
    accessories: [
      { id: 'scarf', name: 'Bufanda', cost: 90, icon: '🧣' },
      { id: 'cape', name: 'Capa', cost: 150, icon: '🦸' },
      { id: 'backpack', name: 'Mochila', cost: 100, icon: '🎒' },
    ]
  },
  {
    id: 'special',
    name: 'Especiales',
    icon: '⭐',
    accessories: [
      { id: 'color', name: 'Color especial', cost: 120, icon: '🌈' },
      { id: 'sparkle', name: 'Brillo', cost: 180, icon: '✨' },
    ]
  }
];

const UNLOCKED_KEY = 'ajolote_unlocked_accessories';

export default function RewardsScreen() {
  const systemColorScheme = useColorScheme();
  const isDark = systemColorScheme === 'dark';
  const palette = isDark ? Colors.dark : Colors;
  const gradientColors: [string, string, string] = isDark
    ? ['#2D2F36', '#3A3D45', '#484C55']
    : ['#F2ECE6', '#E7DFD6', '#DDD2C4'];
  const { points, setPoints } = usePoints();
  const [unlocked, setUnlocked] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

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

  // Animar progreso
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  // Manejar desbloqueo de accesorio con animación
  const handleUnlock = (id: string, cost: number) => {
    if (points >= cost && !unlocked.includes(id)) {
      // Animación de escala
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      setUnlocked([...unlocked, id]);
      setPoints(points - cost);
    }
  };

  const renderRewardItem = ({ item }: { item: any }) => {
    const isUnlocked = unlocked.includes(item.id);
    const canAfford = points >= item.cost;
    
    return (
      <Animated.View 
        style={[
          styles.rewardItem, 
          { 
            backgroundColor: palette.card,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        <Text style={styles.rewardIcon}>{item.icon}</Text>
        <Text style={[styles.rewardName, { color: palette.text }]}>{item.name}</Text>
        <Text style={[styles.rewardCost, { color: palette.textSecondary }]}>
          {item.cost} pts
        </Text>
        <TouchableOpacity
          style={[
            styles.unlockButton,
            { 
              backgroundColor: isUnlocked 
                ? palette.primary 
                : canAfford 
                  ? '#4CAF50' 
                  : '#A89CC8'
            }
          ]}
          disabled={isUnlocked || !canAfford}
          onPress={() => handleUnlock(item.id, item.cost)}
        >
          <Text style={[styles.unlockText, { color: palette.onPrimary }]}>
            {isUnlocked ? '✅ Desbloqueado' : '🔓 Desbloquear'}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const currentCategory = REWARD_CATEGORIES[selectedCategory];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: palette.background }]}>
      <LinearGradient
        colors={gradientColors}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: palette.text }]}>Recompensas</Text>
        <Text style={[styles.pointsText, { color: palette.primary }]}>
          💎 {points} puntos
        </Text>
      </View>

      {/* Barra de progreso mejorada */}
      <View style={styles.levelContainer}>
        <View style={styles.levelHeader}>
          <Text style={[styles.levelText, { color: palette.text }]}>
            Nivel {level} {getLevelIcon(level)}
          </Text>
          <Text style={[styles.nextLevelText, { color: palette.textSecondary }]}>
            Siguiente: {nextLevelPoints} pts
          </Text>
        </View>
        
        <View style={[styles.progressBar, { backgroundColor: palette.card }]}>
          <Animated.View 
            style={[
              styles.progressFill, 
              { 
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
                backgroundColor: palette.primary 
              }
            ]} 
          />
        </View>
        
        <Text style={[styles.progressText, { color: palette.textSecondary }]}>
          {points} / {nextLevelPoints} puntos
        </Text>
      </View>

      {/* Selector de categorías */}
      <View style={styles.categoryContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={REWARD_CATEGORIES}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={[
                styles.categoryButton,
                { 
                  backgroundColor: selectedCategory === index ? palette.primary : palette.card,
                }
              ]}
              onPress={() => setSelectedCategory(index)}
            >
              <Text style={styles.categoryIcon}>{item.icon}</Text>
              <Text style={[
                styles.categoryText, 
                { color: selectedCategory === index ? palette.onPrimary : palette.text }
              ]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.categoryList}
        />
      </View>

      {/* Lista de recompensas */}
      <View style={styles.rewardsContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={currentCategory.accessories}
          keyExtractor={(item) => item.id}
          renderItem={renderRewardItem}
          contentContainerStyle={styles.rewardsList}
          snapToInterval={screenWidth * 0.35 + 20}
          decelerationRate="fast"
        />
      </View>
    </SafeAreaView>
  );
}

const getLevelIcon = (level: number) => {
  const icons = ['🌟', '⭐', '💫', '✨', '🔥'];
  return icons[Math.min(level - 1, icons.length - 1)];
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 16 : 8,
  },
  title: {
    fontFamily: 'Nunito-Bold',
    fontSize: 28,
    marginBottom: 8,
  },
  pointsText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  levelContainer: {
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 8,
  },
  levelText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  nextLevelText: {
    fontSize: 14,
  },
  progressBar: {
    width: '100%',
    height: 20,
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 10,
  },
  progressText: {
    fontSize: 12,
    marginTop: 4,
  },
  categoryContainer: {
    marginBottom: 16,
  },
  categoryList: {
    paddingHorizontal: 20,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    minWidth: 100,
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  rewardsContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  rewardsList: {
    paddingHorizontal: 10,
  },
  rewardItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 20,
    marginHorizontal: 10,
    width: screenWidth * 0.35,
    minHeight: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  rewardIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  rewardName: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 6,
  },
  rewardCost: {
    fontSize: 12,
    marginBottom: 8,
  },
  unlockButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 15,
    alignItems: 'center',
    minWidth: 100,
  },
  unlockText: {
    fontWeight: 'bold',
    fontSize: 12,
  },
}); 