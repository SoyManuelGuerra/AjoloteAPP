import { View, Text, StyleSheet, Switch, TouchableOpacity, useColorScheme, ScrollView, Modal, Alert } from 'react-native';
import { Colors } from '../constants/Colors';
import { useState, useEffect } from 'react';
import { useTasks } from '../context/TasksContext';
import { usePoints } from '../context/PointsContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

export default function SettingsScreen() {
  const systemColorScheme = useColorScheme();
  const isDark = systemColorScheme === 'dark';
  const palette = isDark ? Colors.dark : Colors;
  const gradientColors: [string, string, string] = isDark
    ? [palette.background, palette.card, palette.cardAccent]
    : [palette.cardAccent, palette.cardWarm, palette.card];

  // Colores para elementos de peligro basados en la paleta existente
  const dangerColors = {
    background: isDark ? palette.cardAccent : palette.card,
    title: palette.text,
    description: palette.textSecondary,
    border: '#FF6B6B', // Color de alerta que funciona en ambos temas
  };

  // Estados para configuraciones
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(systemColorScheme === 'dark');
  const [language, setLanguage] = useState('es');
  const [showResetModal, setShowResetModal] = useState(false);

  // Contextos para reiniciar progreso
  const { setPoints } = usePoints();
  const { setTasks } = useTasks();

  // Función para reiniciar progreso
  const handleResetProgress = async () => {
    setShowResetModal(false);
    
    Alert.alert(
      '¿Estás seguro?',
      'Esta acción reiniciará tus puntos, tareas y accesorios desbloqueados. No se puede deshacer.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Reiniciar',
          style: 'destructive',
          onPress: async () => {
            setPoints(0);
            setTasks([]);
            await AsyncStorage.setItem('ajolote_unlocked_accessories', JSON.stringify([]));
          },
        },
      ]
    );
  };

  // Cargar configuraciones guardadas
  useEffect(() => {
    (async () => {
      try {
        const settings = await AsyncStorage.getItem('app_settings');
        if (settings) {
          const parsedSettings = JSON.parse(settings);
          setNotificationsEnabled(parsedSettings.notifications ?? true);
          setLanguage(parsedSettings.language ?? 'es');
        }
      } catch (error) {
        console.log('Error loading settings:', error);
      }
    })();
  }, []);

  // Guardar configuraciones cuando cambian
  useEffect(() => {
    const settings = {
      notifications: notificationsEnabled,
      language: language,
      darkMode: darkMode,
    };
    AsyncStorage.setItem('app_settings', JSON.stringify(settings));
  }, [notificationsEnabled, language, darkMode]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: palette.background }} contentContainerStyle={styles.container}>
      <LinearGradient
        colors={gradientColors}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
      
      {/* Header con botón de regreso */}
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: palette.cardWarm }]}
          onPress={() => router.back()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: palette.text }]}>Configuración</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Sección de notificaciones */}
      <View style={[styles.section, { backgroundColor: palette.cardWarm }]}>
        <Text style={[styles.sectionTitle, { color: palette.text }]}>Notificaciones</Text>
        <View style={styles.row}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingLabel, { color: palette.text }]}>Notificaciones push</Text>
            <Text style={[styles.settingDescription, { color: palette.textSecondary }]}>
              Recibe recordatorios y alertas importantes
            </Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: palette.textSecondary + '40', true: palette.primary + '60' }}
            thumbColor={notificationsEnabled ? palette.primary : palette.textSecondary}
          />
        </View>
      </View>

      {/* Sección de apariencia */}
      <View style={[styles.section, { backgroundColor: palette.cardWarm }]}>
        <Text style={[styles.sectionTitle, { color: palette.text }]}>Apariencia</Text>
        
        <View style={styles.row}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingLabel, { color: palette.text }]}>Tema oscuro</Text>
            <Text style={[styles.settingDescription, { color: palette.textSecondary }]}>
              Actualmente usando tema {darkMode ? 'oscuro' : 'claro'}
            </Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: palette.textSecondary + '40', true: palette.primary + '60' }}
            thumbColor={darkMode ? palette.primary : palette.textSecondary}
          />
        </View>
      </View>

      {/* Sección de idioma */}
      <View style={[styles.section, { backgroundColor: palette.cardWarm }]}>
        <Text style={[styles.sectionTitle, { color: palette.text }]}>Idioma</Text>
        <Text style={[styles.settingDescription, { color: palette.textSecondary, marginBottom: 16 }]}>
          Selecciona tu idioma preferido
        </Text>
        
        <View style={styles.languageSelector}>
          <TouchableOpacity
            onPress={() => setLanguage('es')}
            style={[
              styles.languageOption,
              {
                backgroundColor: language === 'es' ? palette.primary : palette.background,
                borderColor: palette.primary,
              }
            ]}
          >
            <Text style={[
              styles.languageText,
              { color: language === 'es' ? palette.onPrimary : palette.text }
            ]}>
              🇪🇸 Español
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => setLanguage('en')}
            style={[
              styles.languageOption,
              {
                backgroundColor: language === 'en' ? palette.primary : palette.background,
                borderColor: palette.primary,
              }
            ]}
          >
            <Text style={[
              styles.languageText,
              { color: language === 'en' ? palette.onPrimary : palette.text }
            ]}>
              🇺🇸 English
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Sección de datos y privacidad */}
      <View style={[styles.section, { backgroundColor: palette.cardWarm }]}>
        <Text style={[styles.sectionTitle, { color: palette.text }]}>Datos y Privacidad</Text>
        
        <TouchableOpacity style={styles.settingButton}>
          <Text style={[styles.settingLabel, { color: palette.text }]}>Exportar mis datos</Text>
          <Text style={[styles.arrow, { color: palette.textSecondary }]}>→</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingButton}>
          <Text style={[styles.settingLabel, { color: palette.text }]}>Política de privacidad</Text>
          <Text style={[styles.arrow, { color: palette.textSecondary }]}>→</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingButton}>
          <Text style={[styles.settingLabel, { color: palette.text }]}>Términos de servicio</Text>
          <Text style={[styles.arrow, { color: palette.textSecondary }]}>→</Text>
        </TouchableOpacity>
      </View>

      {/* Sección avanzada */}
      <View style={[styles.section, { backgroundColor: palette.cardWarm }]}>
        <Text style={[styles.sectionTitle, { color: palette.text }]}>Configuración Avanzada</Text>
        
        <TouchableOpacity
          style={[
            styles.dangerButton, 
            { 
              backgroundColor: dangerColors.background,
              borderColor: dangerColors.border,
              borderWidth: 2,
            }
          ]}
          onPress={handleResetProgress}
        >
          <Text style={styles.dangerIcon}>⚠️</Text>
          <View style={styles.dangerTextContainer}>
            <Text style={[styles.dangerTitle, { color: dangerColors.title }]}>
              Reiniciar progreso
            </Text>
            <Text style={[styles.dangerDescription, { color: dangerColors.description }]}>
              Elimina todos tus puntos, tareas y progreso
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Sección de información */}
      <View style={[styles.section, { backgroundColor: palette.cardWarm }]}>
        <Text style={[styles.sectionTitle, { color: palette.text }]}>Información</Text>
        
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: palette.textSecondary }]}>Versión de la app</Text>
          <Text style={[styles.infoValue, { color: palette.text }]}>1.0.0</Text>
        </View>
        
        <TouchableOpacity style={styles.settingButton}>
          <Text style={[styles.settingLabel, { color: palette.text }]}>Contactar soporte</Text>
          <Text style={[styles.arrow, { color: palette.textSecondary }]}>→</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingButton}>
          <Text style={[styles.settingLabel, { color: palette.text }]}>Valorar la app</Text>
          <Text style={[styles.arrow, { color: palette.textSecondary }]}>→</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 24,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backIcon: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  title: {
    fontFamily: 'Nunito-Bold',
    fontSize: 28,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 44,
  },
  section: {
    width: '100%',
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000000',
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
  },
  languageSelector: {
    gap: 12,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 2,
    marginBottom: 8,
  },
  languageText: {
    fontSize: 16,
    fontWeight: '600',
  },
  settingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  arrow: {
    fontSize: 16,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    gap: 12,
  },
  dangerIcon: {
    fontSize: 24,
  },
  dangerTextContainer: {
    flex: 1,
  },
  dangerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  dangerDescription: {
    fontSize: 13,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  infoLabel: {
    fontSize: 14,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
  },
});
