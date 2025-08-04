import { View, Text, StyleSheet, useColorScheme, FlatList, TouchableOpacity, Animated, Dimensions, SafeAreaView, StatusBar, Platform } from 'react-native';
import { Colors } from '../../constants/Colors';
import { usePoints } from '../../context/PointsContext';
import { useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

const { width: screenWidth } = Dimensions.get('window');

// Configuración de niveles
const LEVELS = [0, 100, 250, 500, 1000];

// Accesorios simplificados - solo los más importantes
const REWARD_CATEGORIES = [
  {
    id: 'hats',
    name: 'Sombreros',
    icon: '🎩',
    accessories: [
      { id: 'hat', name: 'Gorro', cost: 50, icon: '🎩' },
      { id: 'crown', name: 'Corona', cost: 200, icon: '👑' },
    ]
  },
  {
    id: 'accessories',
    name: 'Accesorios',
    icon: '👓',
    accessories: [
      { id: 'glasses', name: 'Gafas', cost: 80, icon: '👓' },
      { id: 'bowtie', name: 'Moño', cost: 110, icon: '🎀' },
    ]
  },
  {
    id: 'special',
    name: 'Especiales',
    icon: '⭐',
    accessories: [
      { id: 'color', name: 'Color especial', cost: 120, icon: '🌈' },
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

  const renderRewardItem = ({ item }: { item: any }) => {
    const isUnlocked = unlocked.includes(item.id);
    const canAfford = points >= item.cost;
    
    return (
      <View 
        style={[
          styles.rewardItem, 
          { backgroundColor: palette.cardWarm }
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
                  ? palette.primary 
                  : '#A89CC8'
            }
          ]}
          disabled={isUnlocked || !canAfford}
          onPress={() => handleUnlock(item.id, item.cost)}
        >
          <Text style={[styles.unlockText, { color: palette.onPrimary }]}>
            {isUnlocked ? 'Desbloqueado' : 'Desbloquear'}
          </Text>
        </TouchableOpacity>
      </View>
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
      
      {/* Header simplificado */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: palette.text }]}>Recompensas</Text>
        <Text style={[styles.pointsText, { color: palette.primary }]}>
          {points} puntos
        </Text>
      </View>

      {/* Progreso simplificado */}
      <View style={styles.levelContainer}>
        <Text style={[styles.levelText, { color: palette.text }]}>
          Nivel {level}
        </Text>
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
                  backgroundColor: selectedCategory === index ? palette.primary : palette.cardWarm,
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
          snapToInterval={screenWidth * 0.4 + 20}
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
    marginBottom: '2%',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 16 : 8,
  },
  title: {
    fontFamily: 'Nunito-Bold',
    fontSize: 28,
    marginBottom: '1%',
  },
  pointsText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  levelContainer: {
    alignItems: 'center',
    marginBottom: '3%',
  },
  levelText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: '1%',
  },
  progressText: {
    fontSize: 14,
    color: '#666',
  },
  categoryContainer: {
    marginBottom: '2%',
  },
  categoryList: {
    paddingHorizontal: '2.5%',
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '2%',
    paddingVertical: '1%',
    borderRadius: 20,
    marginRight: '1.5%',
    minWidth: 100,
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: '0.8%',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  rewardsContainer: {
    flex: 1,
    paddingHorizontal: '2.5%',
    paddingBottom: '2.5%',
  },
  rewardsList: {
    paddingHorizontal: '1.2%',
  },
  rewardItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3%',
    borderRadius: 16,
    marginHorizontal: '2%',
    width: screenWidth * 0.4,
    minHeight: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  rewardIcon: {
    fontSize: 32,
    marginBottom: '2%',
  },
  rewardName: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '0.8%',
  },
  rewardCost: {
    fontSize: 12,
    marginBottom: '1%',
  },
  unlockButton: {
    paddingVertical: '2%',
    paddingHorizontal: '3%',
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 80,
  },
  unlockText: {
    fontWeight: 'bold',
    fontSize: 12,
  },
}); 