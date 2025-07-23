import { View, Text, StyleSheet, Switch, TouchableOpacity, useColorScheme, ScrollView, Image, TextInput, Modal } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useState, useEffect } from 'react';
import { useTasks } from '../../context/TasksContext';
import { usePoints } from '../../context/PointsContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

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

  // Estados locales para switches (sin lógica real aún)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(systemColorScheme === 'dark');
  const [language, setLanguage] = useState('es');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);

  // Función para reiniciar progreso (solo resetea puntos, tareas y accesorios)
  const { setPoints } = usePoints();
  const { setTasks } = useTasks();
  const handleResetProgress = async () => {
    setShowResetModal(false);
    setPoints(0);
    setTasks([]);
    await AsyncStorage.setItem('ajolote_unlocked_accessories', JSON.stringify([]));
  };

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
      <Text style={[styles.title, { color: palette.text }]}>Perfil y Configuración</Text>
      {/* Bloque de mascota/perfil */}
      <Text style={[styles.groupTitle, { color: palette.text }]}>Tu Ajolote</Text>
      <View style={[styles.profileBox, { backgroundColor: palette.card }] }>
        <Image source={require('../../assets/images/axofi-logo-v1.png')} style={styles.avatar} />
        <Text style={[styles.petName, { color: palette.text }]}>{petName}</Text>
        <View style={styles.levelRow}>
          <Text style={styles.levelIcon}>🌱</Text>
          <Text style={[styles.levelText, { color: palette.primary }]}>Nivel {level}</Text>
        </View>
        <View style={styles.pointsRow}>
          <Text style={styles.pointsIcon}>⭐</Text>
          <Text style={[styles.pointsText, { color: palette.textSecondary }]}>Puntos: {points}</Text>
        </View>
      </View>
      {/* Sección de cuenta */}
      <Text style={[styles.groupTitle, { color: palette.text }]}>Cuenta</Text>
      <View style={[styles.accountSection, { backgroundColor: palette.card }] }>
        <Text style={[styles.sectionTitle, { color: palette.text, marginBottom: 14 }]}>Datos de cuenta</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: palette.background,
              color: palette.text,
              borderColor: palette.accent,
              borderRadius: 12,
              paddingVertical: 12,
              paddingHorizontal: 14,
              fontSize: 16,
              marginBottom: 10,
            },
          ]}
          placeholder="Nombre de usuario"
          placeholderTextColor={palette.textSecondary}
          value={userName}
          onChangeText={setUserName}
        />
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: palette.background,
              color: palette.text,
              borderColor: palette.accent,
              borderRadius: 12,
              paddingVertical: 12,
              paddingHorizontal: 14,
              fontSize: 16,
              marginBottom: 10,
            },
          ]}
          placeholder="Email"
          placeholderTextColor={palette.textSecondary}
          value={userEmail}
          onChangeText={setUserEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      {/* Sección de notificaciones */}
      <Text style={[styles.groupTitle, { color: palette.text }]}>Notificaciones</Text>
      <View style={[styles.section, { backgroundColor: palette.card }] }>
        <Text style={[styles.sectionTitle, { color: palette.text }]}>Notificaciones</Text>
        <View style={styles.row}>
          <Text style={{ color: palette.text }}>Activar notificaciones</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#4D4F55', true: '#A8C3B8' }}
            thumbColor={notificationsEnabled ? '#F6F4EF' : '#888'}
          />
        </View>
        <Text style={{ color: palette.textSecondary, fontSize: 12, marginTop: 2 }}>
          Recibirás recordatorios diarios y alertas si tu ajolote desbloquea recompensas.
        </Text>
      </View>
      {/* Sección de preferencias */}
      <Text style={[styles.groupTitle, { color: palette.text }]}>Preferencias</Text>
      <View style={[styles.section, { backgroundColor: palette.card }] }>
        <Text style={[styles.sectionTitle, { color: palette.text }]}>Preferencias</Text>
        <View style={styles.row}>
          <Text style={{ color: palette.text }}>Tema oscuro</Text>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: '#4D4F55', true: '#A8C3B8' }}
            thumbColor={darkMode ? '#F6F4EF' : '#888'}
          />
        </View>
        <Text style={{ color: palette.textSecondary, fontSize: 12, marginBottom: 10 }}>
          Usando tema {darkMode ? 'oscuro' : 'claro'}
        </Text>
        <Text style={[styles.languageLabel, { color: palette.text }]}>Idioma preferido</Text>
        <View style={styles.languageSelector}>
          <TouchableOpacity
            onPress={() => setLanguage('es')}
            style={[
              styles.pillToggle,
              language === 'es'
                ? { backgroundColor: palette.primary, borderColor: palette.primary }
                : { borderColor: palette.primary },
            ]}
          >
            <Text style={{
              color: language === 'es' ? palette.onPrimary : palette.text,
              fontWeight: '600',
              fontSize: 16,
            }}>ES</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setLanguage('en')}
            style={[
              styles.pillToggle,
              language === 'en'
                ? { backgroundColor: palette.primary, borderColor: palette.primary }
                : { borderColor: palette.primary },
            ]}
          >
            <Text style={{
              color: language === 'en' ? palette.onPrimary : palette.text,
              fontWeight: '600',
              fontSize: 16,
            }}>EN</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Sección avanzada */}
      <Text style={[styles.groupTitle, { color: palette.text }]}>Avanzado</Text>
      <View style={[styles.section, { backgroundColor: palette.card }] }>
        <Text style={[styles.sectionTitle, { color: palette.text }]}>Progreso</Text>
        <TouchableOpacity
          style={[
            styles.resetButton,
            {
              backgroundColor: isDark ? '#D36A6A' : '#FFCCCC',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 8,
            },
          ]}
          onPress={() => setShowResetModal(true)}
        >
          <Text style={{ fontSize: 18, marginRight: 6 }}>⚠️</Text>
          <Text style={{ color: isDark ? '#fff' : '#B00020', fontWeight: 'bold', fontSize: 16 }}>
            Reiniciar progreso
          </Text>
        </TouchableOpacity>
        {/* Modal de confirmación */}
        <Modal
          visible={showResetModal}
          animationType="fade"
          transparent
          onRequestClose={() => setShowResetModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: palette.card }] }>
              <Text style={{ color: palette.text, fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>¿Estás seguro?</Text>
              <Text style={{ color: palette.textSecondary, fontSize: 13, marginBottom: 18, textAlign: 'center' }}>
                Esta acción reiniciará tus puntos, tareas y accesorios desbloqueados. No se puede deshacer.
              </Text>
              <View style={{ flexDirection: 'row', gap: 12, width: '100%', justifyContent: 'space-between' }}>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: palette.primary }]}
                  onPress={handleResetProgress}
                >
                  <Text style={{ color: palette.onPrimary, fontWeight: 'bold' }}>Reiniciar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: isDark ? '#333' : '#eee' }]}
                  onPress={() => setShowResetModal(false)}
                >
                  <Text style={{ color: palette.primary, fontWeight: 'bold' }}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
      {/* Sección: Contacto */}
      <View style={[styles.section, { backgroundColor: palette.card }] }>
        <Text style={[styles.sectionTitle, { color: palette.text }]}>Contacto</Text>
        <Text style={{ color: palette.textSecondary, fontSize: 12 }}>¿Tienes dudas o sugerencias? Escríbenos a soporte@ajoloteapp.com</Text>
      </View>
      {/* Sección: Info legal */}
      <View style={[styles.section, { backgroundColor: palette.card }] }>
        <Text style={[styles.sectionTitle, { color: palette.text }]}>Información legal</Text>
        <Text style={{ color: palette.textSecondary, fontSize: 11 }}>Términos y condiciones | Política de privacidad</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 24,
    paddingBottom: 48,
  },
  profileBox: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 18,
    padding: 22,
    backgroundColor: Colors.card,
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginBottom: 8,
  },
  petName: {
    fontFamily: 'Nunito-Bold',
    fontSize: 20,
    marginBottom: 2,
  },
  title: {
    fontFamily: 'Nunito-Bold',
    fontSize: 28,
    marginTop: 48,
    marginBottom: 24,
    color: Colors.text,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 28,
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  section: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: Colors.card,
    borderRadius: 18,
    padding: 18,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontFamily: 'Nunito-Bold',
    fontSize: 18,
    marginBottom: 10,
    color: Colors.text,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  languageSelector: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
    marginBottom: 2,
  },
  langButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginHorizontal: 2,
    backgroundColor: Colors.card,
  },
  resetButton: {
    marginTop: 8,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 2,
  },
  input: {
    width: '100%',
    backgroundColor: Colors.background,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.accent,
    marginBottom: 10,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 2,
    gap: 6,
  },
  levelIcon: {
    fontSize: 22,
    marginRight: 2,
  },
  levelText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 22,
    fontWeight: 'bold',
  },
  pointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
    gap: 6,
  },
  pointsIcon: {
    fontSize: 20,
    marginRight: 2,
  },
  pointsText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 18,
    fontWeight: 'bold',
  },
  accountSection: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: Colors.card,
    borderRadius: 18,
    padding: 18,
    marginBottom: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  languageLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 8,
  },
  pillToggle: {
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 24,
    backgroundColor: Colors.card,
    marginHorizontal: 2,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 24,
    width: 320,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  modalButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
}); 