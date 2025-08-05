import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '../hooks/useColorScheme';
import { Colors } from '../constants/Colors';

export default function LoginScreen() {
  const colorScheme = useColorScheme();
  const palette = colorScheme === 'dark' ? Colors.dark : Colors;
  const isDark = colorScheme === 'dark';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      setErrorMessage('Por favor ingresa tu email');
      setErrorModalVisible(true);
      return false;
    }
    if (!formData.email.includes('@')) {
      setErrorMessage('Por favor ingresa un email válido');
      setErrorModalVisible(true);
      return false;
    }
    if (!formData.password.trim()) {
      setErrorMessage('Por favor ingresa tu contraseña');
      setErrorModalVisible(true);
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      // Aquí iría la lógica de login real
      // Por ahora simulamos un delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccessModalVisible(true);
    } catch (error) {
      setErrorMessage('Credenciales incorrectas. Intenta de nuevo.');
      setErrorModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleForgotPassword = () => {
    setErrorMessage('Esta funcionalidad estará disponible próximamente.');
    setErrorModalVisible(true);
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: palette.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={isDark 
          ? [palette.background, palette.cardWarm, palette.background]
          : [palette.background, palette.cardWarm, palette.background]
        }
        style={styles.gradient}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={handleBack}
              activeOpacity={0.7}
            >
              <Ionicons 
                name="arrow-back" 
                size={24} 
                color={palette.text} 
              />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: palette.text }]}>
              Iniciar Sesión
            </Text>
            <View style={styles.placeholder} />
          </View>

          {/* Logo/Icon */}
          <View style={styles.logoContainer}>
            <View style={[styles.logoCircle, { backgroundColor: palette.cardWarm }]}>
              <Ionicons 
                name="log-in" 
                size={60} 
                color={palette.primary} 
              />
            </View>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            <Text style={[styles.welcomeText, { color: palette.text }]}>
              ¡Bienvenido de vuelta!
            </Text>
            <Text style={[styles.subtitleText, { color: palette.textSecondary }]}>
              Inicia sesión para continuar tu aventura
            </Text>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: palette.text }]}>
                Email
              </Text>
              <View style={[styles.inputWrapper, { 
                backgroundColor: palette.card,
                borderColor: formData.email ? palette.primary : palette.textSecondary
              }]}>
                <Ionicons 
                  name="mail" 
                  size={20} 
                  color={palette.textSecondary} 
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, { color: palette.text }]}
                  placeholder="tu@email.com"
                  placeholderTextColor={palette.textSecondary}
                  value={formData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: palette.text }]}>
                Contraseña
              </Text>
              <View style={[styles.inputWrapper, { 
                backgroundColor: palette.card,
                borderColor: formData.password ? palette.primary : palette.textSecondary
              }]}>
                <Ionicons 
                  name="lock-closed" 
                  size={20} 
                  color={palette.textSecondary} 
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, { color: palette.text }]}
                  placeholder="Tu contraseña"
                  placeholderTextColor={palette.textSecondary}
                  value={formData.password}
                  onChangeText={(value) => handleInputChange('password', value)}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity 
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  <Ionicons 
                    name={showPassword ? "eye-off" : "eye"} 
                    size={20} 
                    color={palette.textSecondary} 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password Link */}
            <TouchableOpacity 
              style={styles.forgotPasswordContainer}
              onPress={handleForgotPassword}
            >
              <Text style={[styles.forgotPasswordText, { color: palette.primary }]}>
                ¿Olvidaste tu contraseña?
              </Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              style={[
                styles.loginButton,
                { 
                  backgroundColor: loading ? palette.textSecondary : palette.primary,
                  opacity: loading ? 0.7 : 1
                }
              ]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={[styles.loginButtonText, { color: palette.onPrimary }]}>
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Text>
            </TouchableOpacity>

            {/* Register Link */}
            <View style={styles.registerContainer}>
              <Text style={[styles.registerText, { color: palette.textSecondary }]}>
                ¿No tienes cuenta?{' '}
              </Text>
              <TouchableOpacity onPress={() => router.push('/register-screen')}>
                <Text style={[styles.registerLink, { color: palette.primary }]}>
                  Crear Cuenta
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Modal de Error */}
        <Modal
          visible={errorModalVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setErrorModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: palette.cardWarm }]}>
              <Text style={[styles.modalTitle, { color: palette.text }]}>Error</Text>
              <Text style={[styles.modalText, { color: palette.textSecondary }]}>
                {errorMessage}
              </Text>
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: palette.primary }]}
                onPress={() => setErrorModalVisible(false)}
              >
                <Text style={[styles.modalButtonText, { color: palette.onPrimary }]}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modal de Éxito */}
        <Modal
          visible={successModalVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setSuccessModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: palette.cardWarm }]}>
              <Text style={[styles.modalTitle, { color: palette.text }]}>¡Bienvenido!</Text>
              <Text style={[styles.modalText, { color: palette.textSecondary }]}>
                Sesión iniciada exitosamente
              </Text>
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: palette.primary }]}
                onPress={() => {
                  setSuccessModalVisible(false);
                  router.replace('/(tabs)/tasks');
                }}
              >
                <Text style={[styles.modalButtonText, { color: palette.onPrimary }]}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  formContainer: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  eyeButton: {
    padding: 4,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    fontSize: 16,
  },
  registerLink: {
    fontSize: 16,
    fontWeight: '600',
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
  modalTitle: {
    fontFamily: 'Nunito-Bold',
    fontSize: 22,
    marginBottom: 16,
    color: Colors.text,
  },
  modalText: {
    fontFamily: 'Nunito',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  modalButton: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignItems: 'center',
    minWidth: 120,
  },
  modalButtonText: {
    color: Colors.onPrimary,
    fontFamily: 'Nunito-Bold',
    fontSize: 16,
  },
}); 