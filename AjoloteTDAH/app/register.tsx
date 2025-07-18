import { View, Text, StyleSheet, useColorScheme, TouchableOpacity, Animated, TextInput, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRef, useEffect, useState } from 'react';
import { router } from 'expo-router';

export default function RegisterScreen() {
  const systemColorScheme = useColorScheme();
  const gradientColors: [string, string] = systemColorScheme === 'dark'
    ? ['#305252', '#4C5B61']
    : ['#F4F8FB', '#B9E9F7'];

  // Animación para el título
  const titleScale = useRef(new Animated.Value(0.7)).current;
  useEffect(() => {
    Animated.sequence([
      Animated.spring(titleScale, {
        toValue: 1.15,
        friction: 2,
        useNativeDriver: true,
      }),
      Animated.spring(titleScale, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = () => {
    if (!email || !password || !confirmPassword) {
      setError('Completa todos los campos.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    setError('');
    // Aquí iría la lógica real de registro
    alert('¡Registro simulado exitoso!');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={gradientColors}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/explore')}>
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>
      <Animated.Text
        style={[
          styles.title,
          { fontWeight: 'bold' },
          { transform: [{ scale: titleScale }] },
          systemColorScheme === 'dark' && { color: '#F4F8FB' }
        ]}
      >
        ¡Crea tu cuenta!
      </Animated.Text>
      <View style={styles.formBlock}>
        <TextInput
          style={[styles.input, systemColorScheme === 'dark' && styles.inputDark]}
          placeholder="Correo electrónico"
          placeholderTextColor={systemColorScheme === 'dark' ? '#B9E9F7' : '#588686'}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={[styles.input, systemColorScheme === 'dark' && styles.inputDark]}
          placeholder="Contraseña"
          placeholderTextColor={systemColorScheme === 'dark' ? '#B9E9F7' : '#588686'}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={[styles.input, systemColorScheme === 'dark' && styles.inputDark]}
          placeholder="Confirmar contraseña"
          placeholderTextColor={systemColorScheme === 'dark' ? '#B9E9F7' : '#588686'}
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <TouchableOpacity style={styles.registerButton} onPress={handleRegister} activeOpacity={0.8}>
          <Text style={styles.registerButtonText}>Registrarse</Text>
        </TouchableOpacity>
        <View style={styles.separatorBlock}>
          <View style={styles.separatorLine} />
          <Text style={styles.separatorText}>o</Text>
          <View style={styles.separatorLine} />
        </View>
        <TouchableOpacity style={[styles.socialButton, styles.googleButton]} activeOpacity={0.8}>
          <Text style={styles.socialButtonText}>Continuar con Google</Text>
        </TouchableOpacity>
        {Platform.OS === 'ios' && (
          <TouchableOpacity style={[styles.socialButton, styles.appleButton]} activeOpacity={0.8}>
            <Text style={[styles.socialButtonText, { color: '#fff' }]}>Continuar con Apple</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F8FB',
    padding: 32,
  },
  title: {
    fontFamily: 'Nunito-Bold',
    fontSize: 32,
    color: '#305252',
    marginBottom: 32,
    textAlign: 'center',
    letterSpacing: 1.1,
  },
  formBlock: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    marginTop: 8,
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 18,
    fontSize: 18,
    color: '#305252',
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#B9E9F7',
    fontFamily: 'Nunito',
  },
  inputDark: {
    backgroundColor: '#305252',
    color: '#F4F8FB',
    borderColor: '#4C5B61',
  },
  errorText: {
    color: '#f78fc7',
    fontSize: 15,
    marginBottom: 10,
    fontFamily: 'Nunito-Bold',
    textAlign: 'center',
  },
  registerButton: {
    backgroundColor: '#f78fc7',
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 56,
    marginTop: 8,
    marginBottom: 18,
    shadowColor: '#f78fc7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    alignItems: 'center',
  },
  registerButtonText: {
    fontFamily: 'Nunito-Bold',
    color: '#fff',
    fontWeight: '700',
    fontSize: 20,
    letterSpacing: 1.1,
  },
  separatorBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 10,
  },
  separatorLine: {
    flex: 1,
    height: 1.5,
    backgroundColor: '#B9E9F7',
    borderRadius: 1,
  },
  separatorText: {
    marginHorizontal: 12,
    fontSize: 16,
    color: '#a5bab9',
    fontFamily: 'Nunito-Bold',
  },
  socialButton: {
    width: '100%',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#B9E9F7',
  },
  googleButton: {
    backgroundColor: '#B9E9F7',
    borderColor: '#B9E9F7',
  },
  appleButton: {
    backgroundColor: '#305252',
    borderColor: '#305252',
  },
  socialButtonText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 18,
    color: '#305252',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 24,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  backButtonText: {
    fontSize: 22,
    color: '#305252',
    fontWeight: 'bold',
  },
}); 