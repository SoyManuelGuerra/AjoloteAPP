# 🚀 Guía de Despliegue - AjoloteTDAH

## 📱 Opciones de Despliegue

### 1. **Expo Go (Recomendado para Testing Rápido)**

**Ventajas:**
- ✅ Rápido y fácil
- ✅ No requiere build
- ✅ Actualizaciones automáticas
- ✅ Funciona en iOS y Android

**Pasos:**
```bash
npm run start
# o
npx expo start
```

**Para testers:**
1. Descargar Expo Go
2. Escanear QR
3. ¡Listo!

---

### 2. **Build de Desarrollo (APK/IPA)**

**Ventajas:**
- ✅ App independiente
- ✅ No requiere Expo Go
- ✅ Mejor rendimiento
- ✅ Más realista

**Pasos:**
```bash
npm run deploy
# Seleccionar opción 2
```

**Para testers:**
1. Instalar archivo APK/IPA
2. Usar normalmente

---

### 3. **Despliegue en la Nube (EAS Build)**

**Ventajas:**
- ✅ Distribución profesional
- ✅ Actualizaciones OTA
- ✅ Analytics integrado
- ✅ Escalable

**Pasos:**
```bash
# Instalar EAS CLI
npm install -g @expo/eas-cli

# Configurar
eas build:configure

# Crear build
eas build --platform all
```

---

## 🎯 Escenarios de Testing

### **Testing Interno (Amigos/Colegas)**
- **Método:** Expo Go
- **Duración:** 1-2 semanas
- **Objetivo:** Feedback rápido y bugs críticos

### **Testing Externo (Usuarios Reales)**
- **Método:** Build de desarrollo
- **Duración:** 2-4 semanas
- **Objetivo:** Validación de producto

### **Beta Testing (Grupo Grande)**
- **Método:** EAS Build
- **Duración:** 1-2 meses
- **Objetivo:** Preparación para lanzamiento

---

## 📊 Métricas a Seguir

### **Engagement**
- Tiempo en app
- Frecuencia de uso
- Tareas completadas
- Puntos ganados

### **UX/UI**
- Tiempo en cada pantalla
- Flujo de navegación
- Errores reportados
- Feedback cualitativo

### **Funcionalidad**
- Bugs encontrados
- Crashes
- Rendimiento
- Persistencia de datos

---

## 🛠️ Herramientas de Testing

### **Expo DevTools**
- Logs en tiempo real
- Debug de errores
- Métricas de rendimiento

### **Firebase Analytics (Opcional)**
```bash
npm install @react-native-firebase/app
npm install @react-native-firebase/analytics
```

### **Crashlytics (Opcional)**
```bash
npm install @react-native-firebase/crashlytics
```

---

## 📝 Checklist de Despliegue

### **Antes del Testing**
- [ ] App funciona sin errores
- [ ] Datos se persisten correctamente
- [ ] Animaciones son fluidas
- [ ] Modo oscuro/claro funciona
- [ ] Navegación es intuitiva

### **Durante el Testing**
- [ ] Recopilar feedback estructurado
- [ ] Documentar bugs encontrados
- [ ] Medir métricas clave
- [ ] Iterar rápidamente

### **Después del Testing**
- [ ] Analizar feedback
- [ ] Priorizar mejoras
- [ ] Planificar siguiente iteración
- [ ] Documentar aprendizajes

---

## 🔧 Comandos Útiles

```bash
# Iniciar servidor de desarrollo
npm start

# Testing con túnel (para dispositivos externos)
npm run test

# Build para Android
npm run build:android

# Build para iOS
npm run build:ios

# Deploy automático
npm run deploy
```

---

## 📞 Soporte

**Para testers:**
- Crear issue en GitHub
- Enviar email con screenshots
- Usar formulario de feedback

**Para desarrolladores:**
- Revisar logs de Expo
- Usar React Native Debugger
- Monitorear métricas

---

**¡Listo para el testing! 🦎✨** 