# Axofi - AjoloteTDAH

Aplicación móvil multiplataforma para gestión de tareas y acompañamiento cognitivo, pensada para personas con TDAH. Construida con Expo, React Native y TypeScript.

## 🎯 Características

- **Gestión de Tareas**: Crear, editar y completar tareas con sistema de puntos
- **Mascota Virtual**: Ajolote interactivo que acompaña al usuario
- **Sistema de Recompensas**: Puntos y logros por completar tareas
- **Perfil Personalizado**: Seguimiento de progreso y estadísticas
- **Diseño Accesible**: Interfaz optimizada para personas con TDAH

## 📱 Tecnologías

- **Expo SDK 53** - Framework de desarrollo multiplataforma
- **React Native 0.79.5** - Framework de UI nativa
- **TypeScript** - Tipado estático para mayor robustez
- **expo-router** - Navegación basada en archivos
- **React 19** - Biblioteca de UI moderna

## 🚀 Requisitos previos

- Node.js >= 18.x
- npm >= 9.x
- Git

## 📦 Instalación

1. Clona el repositorio y entra al directorio del proyecto:
   ```bash
   git clone <REPO_URL>
   cd AjoloteAPP/Axofi
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

## 🛠️ Desarrollo

### Iniciar el proyecto
```bash
npm start
# o
npx expo start
```

Esto abrirá el panel de Expo donde puedes:
- Escanear el QR con Expo Go (Android/iOS)
- Lanzar el emulador Android/iOS
- Probar en web

### Scripts disponibles
- `npm run android` — Abre en emulador Android
- `npm run ios` — Abre en emulador iOS  
- `npm run web` — Abre en navegador
- `npm run lint` — Linting del proyecto
- `npm run reset-project` — Limpia y reinicia el proyecto
- `npm run test` — Inicia con túnel para pruebas remotas
- `npm run build:android` — Construye APK para Android
- `npm run build:ios` — Construye para iOS

## 📁 Estructura del proyecto

```
Axofi/
├── app/                    # Pantallas principales (expo-router)
│   ├── (tabs)/            # Navegación por pestañas
│   │   ├── tasks.tsx      # Gestión de tareas
│   │   ├── pet.tsx        # Mascota virtual
│   │   ├── rewards.tsx    # Sistema de recompensas
│   │   └── profile.tsx    # Perfil del usuario
│   ├── welcome.tsx        # Pantalla de bienvenida
│   ├── register.tsx       # Registro de usuario
│   └── ChooseAccess.tsx   # Selección de acceso
├── components/            # Componentes reutilizables
├── constants/             # Colores y constantes globales
├── context/              # Contextos globales (tareas, puntos)
├── hooks/                # Hooks personalizados
├── assets/               # Imágenes, íconos y fuentes
└── scripts/              # Scripts de utilidad
```

## 🎨 Características técnicas

- **Navegación**: expo-router con file-based routing
- **Estado Global**: Context API para tareas y puntos
- **Almacenamiento**: AsyncStorage para persistencia local
- **Animaciones**: react-native-reanimated y SVG
- **UI/UX**: Diseño optimizado para accesibilidad y TDAH
- **Colores**: Sistema de colores personalizable en `constants/Colors.ts`

## 📦 Dependencias principales

- `@react-native-async-storage/async-storage` - Almacenamiento local
- `react-native-svg` - Gráficos vectoriales
- `expo-haptics` - Retroalimentación háptica
- `expo-linear-gradient` - Gradientes
- `expo-blur` - Efectos de desenfoque
- `react-native-gesture-handler` - Gestos nativos

## 🤝 Contribuir

1. Haz un fork del repo y crea una rama para tu feature/fix
2. Haz tus cambios y asegúrate de que todo funcione (`npm start` y pruebas manuales)
3. Haz un PR con una descripción clara de tu aporte

## 📚 Recursos y documentación

- [Expo](https://expo.dev/)
- [React Native](https://reactnative.dev/)
- [expo-router](https://expo.github.io/router/docs/)
- [react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [react-native-svg](https://github.com/software-mansion/react-native-svg)

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

¿Dudas? Contacta al equipo o abre un issue en el repositorio.
