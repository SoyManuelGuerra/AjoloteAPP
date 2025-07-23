# AjoloteTDAH

Aplicación móvil multiplataforma para gestión de tareas y acompañamiento cognitivo, pensada para personas con TDAH. Construida con Expo, React Native y TypeScript.

## Requisitos previos

- Node.js >= 18.x
- npm >= 9.x
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (opcional, recomendado)
- Git

## Instalación

1. Clona el repositorio y entra al directorio del proyecto:
   ```bash
   git clone <REPO_URL>
   cd AjoloteTDAH
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```

## Uso y desarrollo

- **Inicia el proyecto en modo desarrollo:**
  ```bash
  npm start
  # o
  npx expo start
  ```
  Esto abrirá el panel de Expo donde puedes:
  - Escanear el QR con Expo Go (Android/iOS)
  - Lanzar el emulador Android/iOS
  - Probar en web

- **Scripts útiles:**
  - `npm run android` — Abre en emulador Android
  - `npm run ios` — Abre en emulador iOS
  - `npm run web` — Abre en navegador
  - `npm run lint` — Linting del proyecto
  - `npm run reset-project` — Limpia y reinicia el proyecto (útil para desarrollo)

## Estructura del proyecto

- `app/` — Pantallas y rutas principales (file-based routing con expo-router)
- `components/` — Componentes reutilizables
- `constants/` — Colores y constantes globales
- `context/` — Contextos globales (tareas, puntos, etc.)
- `assets/` — Imágenes, íconos y fuentes
- `scripts/` — Scripts de utilidad

## Notas de desarrollo

- El proyecto usa **expo-router** para navegación basada en archivos.
- Los estilos y colores están optimizados para accesibilidad y TDAH.
- Puedes modificar los colores en `constants/Colors.ts`.
- El almacenamiento local usa `@react-native-async-storage/async-storage`.
- Animaciones: `react-native-reanimated` y SVG para barras de progreso.

## Contribuir

1. Haz un fork del repo y crea una rama para tu feature/fix.
2. Haz tus cambios y asegúrate de que todo funcione (`npm start` y pruebas manuales).
3. Haz un PR con una descripción clara de tu aporte.

## Créditos y recursos
- [Expo](https://expo.dev/)
- [React Native](https://reactnative.dev/)
- [expo-router](https://expo.github.io/router/docs/)
- [react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [react-native-svg](https://github.com/software-mansion/react-native-svg)

---

¿Dudas? Contacta al equipo o abre un issue en el repositorio.
