import { View, Text, StyleSheet, TouchableOpacity, useColorScheme, ScrollView, Image, TextInput, Modal } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useState, useEffect } from 'react';
import { useTasks } from '../../context/TasksContext';
import { usePoints } from '../../context/PointsContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const LEVELS = [0, 100, 250, 500, 1000];
const USER_KEY = 'ajolote_user_data';

export default function ProfileScreen() {
  const systemColorScheme = useColorScheme();
  const isDark = systemColorScheme === 'dark';
  const palette = isDark ? Colors.dark : Colors;
  const gradientColors: [string, string, string] = isDark
    ? ['#2D2F36', '#3A3D45', '#484C55']
    : ['#F2ECE6', '#E7DFD6', '#DDD2C4'];
  const { petName } = useTasks();
  const { points } = usePoints();

  // Calcular nivel actual
  let level = 1;
  for (let i = 0; i < LEVELS.length; i++) {
    if (points >= LEVELS[i]) level = i + 1;
  }

  // Estados para datos de usuario
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [helpModalVisible, setHelpModalVisible] = useState(false);

  // Calcular progreso al siguiente nivel
  const currentLevelPoints = LEVELS[level - 1] || 0;
  const nextLevelPoints = LEVELS[level] || LEVELS[LEVELS.length - 1];
  const progressPercentage = level === LEVELS.length 
    ? 100 
    : ((points - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100;

  // Cargar datos de usuario al montar
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(USER_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        setUserName(data.name || '');
        setUserEmail(data.email || '');
      }
    })();
  }, []);

  // Guardar datos de usuario cuando cambian
  useEffect(() => {
    AsyncStorage.setItem(USER_KEY, JSON.stringify({ name: userName, email: userEmail }));
  }, [userName, userEmail]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: palette.background }} contentContainerStyle={styles.container}>
      <LinearGradient
        colors={gradientColors}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
      
      {/* Header con título centrado y botón de configuración en esquina */}
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: palette.text, marginTop: 0, marginBottom: 0 }]}>Mi Perfil</Text>
          <TouchableOpacity 
            style={styles.helpButton}
            onPress={() => setHelpModalVisible(true)}
          >
            <Ionicons name="information-circle-outline" size={20} color={palette.textSecondary} />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => router.push('../settings')}
        >
          <Ionicons name="settings-outline" size={22} color={palette.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Bloque principal de la mascota */}
      <View style={[styles.petCard, { backgroundColor: palette.cardWarm }]}>
        <Image source={require('../../assets/images/axofi-logo-v1.png')} style={styles.avatar} />
        <Text style={[styles.petName, { color: palette.text }]}>{petName}</Text>
        
        {/* Información de nivel */}
        <View style={styles.levelContainer}>
          <View style={styles.levelRow}>
            <Text style={styles.levelIcon}>🌱</Text>
            <Text style={[styles.levelText, { color: palette.primary }]}>Nivel {level}</Text>
          </View>
          
          {/* Barra de progreso */}
          {level < LEVELS.length && (
            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { backgroundColor: palette.background }]}>
                <View 
                  style={[
                    styles.progressFill, 
                    { backgroundColor: palette.primary, width: `${progressPercentage}%` }
                  ]} 
                />
              </View>
              <Text style={[styles.progressText, { color: palette.textSecondary }]}>
                {points}/{nextLevelPoints} puntos
              </Text>
            </View>
          )}
          
          {level === LEVELS.length && (
            <Text style={[styles.maxLevelText, { color: palette.primary }]}>
              ¡Nivel máximo alcanzado! 🏆
            </Text>
          )}
        </View>
        
        {/* Estadísticas rápidas */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>⭐</Text>
            <Text style={[styles.statValue, { color: palette.text }]}>{points}</Text>
            <Text style={[styles.statLabel, { color: palette.textSecondary }]}>Puntos</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>🎯</Text>
            <Text style={[styles.statValue, { color: palette.text }]}>-</Text>
            <Text style={[styles.statLabel, { color: palette.textSecondary }]}>Tareas</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>🏅</Text>
            <Text style={[styles.statValue, { color: palette.text }]}>-</Text>
            <Text style={[styles.statLabel, { color: palette.textSecondary }]}>Logros</Text>
          </View>
        </View>
      </View>

      {/* Información de cuenta */}
      <View style={[styles.section, { backgroundColor: palette.cardWarm }]}>
        <Text style={[styles.sectionTitle, { color: palette.text }]}>Información Personal</Text>
        
        <TextInput
          style={[styles.input, { 
            backgroundColor: palette.background,
            color: palette.text,
            borderColor: palette.accent 
          }]}
          placeholder="Nombre de usuario"
          placeholderTextColor={palette.textSecondary}
          value={userName}
          onChangeText={setUserName}
        />
        
        <TextInput
          style={[styles.input, { 
            backgroundColor: palette.background,
            color: palette.text,
            borderColor: palette.accent 
          }]}
          placeholder="Email"
          placeholderTextColor={palette.textSecondary}
          value={userEmail}
          onChangeText={setUserEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {/* Acciones rápidas */}
      <View style={[styles.section, { backgroundColor: palette.cardWarm }]}>
        <Text style={[styles.sectionTitle, { color: palette.text }]}>Acciones Rápidas</Text>
        
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: palette.primary }]}>
          <Text style={styles.actionIcon}>📊</Text>
          <Text style={[styles.actionText, { color: palette.onPrimary }]}>Ver Estadísticas</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: palette.accent }]}>
          <Text style={styles.actionIcon}>🎨</Text>
          <Text style={[styles.actionText, { color: palette.text }]}>Personalizar Mascota</Text>
        </TouchableOpacity>
      </View>

      {/* Modal de ayuda */}
      <Modal
        visible={helpModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setHelpModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.helpModalContent, { backgroundColor: palette.cardWarm }]}>
            <Text style={[styles.helpTitle, { color: palette.text }]}>¿Qué puedes hacer aquí?</Text>
            
            <View style={styles.helpItem}>
              <Text style={styles.helpIcon}>🐾</Text>
              <View style={styles.helpTextContainer}>
                <Text style={[styles.helpItemTitle, { color: palette.text }]}>Ver el progreso de tu mascota</Text>
                <Text style={[styles.helpItemDescription, { color: palette.textSecondary }]}>
                  Revisa el nivel actual, puntos ganados y progreso hacia el siguiente nivel
                </Text>
              </View>
            </View>

            <View style={styles.helpItem}>
              <Text style={styles.helpIcon}>👤</Text>
              <View style={styles.helpTextContainer}>
                <Text style={[styles.helpItemTitle, { color: palette.text }]}>Editar información personal</Text>
                <Text style={[styles.helpItemDescription, { color: palette.textSecondary }]}>
                  Actualiza tu nombre de usuario y email en cualquier momento
                </Text>
              </View>
            </View>

            <View style={styles.helpItem}>
              <Text style={styles.helpIcon}>📊</Text>
              <View style={styles.helpTextContainer}>
                <Text style={[styles.helpItemTitle, { color: palette.text }]}>Acciones rápidas</Text>
                <Text style={[styles.helpItemDescription, { color: palette.textSecondary }]}>
                  Accede a estadísticas detalladas y personaliza tu mascota
                </Text>
              </View>
            </View>

            <View style={styles.helpItem}>
              <Text style={styles.helpIcon}>⚙️</Text>
              <View style={styles.helpTextContainer}>
                <Text style={[styles.helpItemTitle, { color: palette.text }]}>Configuración</Text>
                <Text style={[styles.helpItemDescription, { color: palette.textSecondary }]}>
                  Toca el botón de configuración para ajustar notificaciones, tema y más
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: palette.primary }]}
              onPress={() => setHelpModalVisible(false)}
            >
              <Text style={[styles.closeButtonText, { color: palette.onPrimary }]}>Entendido</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 16,
    paddingBottom: 24,
  },
  headerContainer: {
    width: '100%',
    maxWidth: 400,
    marginTop: 48,
    marginBottom: 8,
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Nunito-Bold',
    fontSize: 28,
    marginTop: '3%',
    marginBottom: '2%',
    color: Colors.text,
  },
  helpButton: {
    marginLeft: 8,
    padding: 4,
  },
  settingsButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  petCard: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    padding: 24,
    borderRadius: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  petName: {
    fontFamily: 'Nunito-Bold',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  levelContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  levelIcon: {
    fontSize: 24,
  },
  levelText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 24,
    fontWeight: 'bold',
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
  },
  maxLevelText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  section: {
    width: '100%',
    maxWidth: 400,
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontFamily: 'Nunito-Bold',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    width: '100%',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginBottom: 12,
    gap: 8,
  },
  actionIcon: {
    fontSize: 20,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  helpModalContent: {
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 350,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  helpTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  helpItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12,
  },
  helpIcon: {
    fontSize: 20,
    marginTop: 2,
  },
  helpTextContainer: {
    flex: 1,
  },
  helpItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  helpItemDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 