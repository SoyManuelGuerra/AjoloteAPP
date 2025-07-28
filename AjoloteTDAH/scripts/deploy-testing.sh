#!/bin/bash

echo "🚀 AjoloteTDAH - Despliegue para Testing"
echo "=========================================="

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: No se encontró package.json. Asegúrate de estar en el directorio del proyecto."
    exit 1
fi

# Verificar dependencias
echo "📦 Verificando dependencias..."
npm install

# Verificar que Expo CLI esté instalado
if ! command -v npx expo &> /dev/null; then
    echo "❌ Error: Expo CLI no está instalado. Instalando..."
    npm install -g @expo/cli
fi

echo ""
echo "🎯 Opciones de despliegue:"
echo "1. Expo Go (Recomendado para testing rápido)"
echo "2. Build de desarrollo (APK/IPA)"
echo "3. Build de producción"
echo ""

read -p "Selecciona una opción (1-3): " choice

case $choice in
    1)
        echo "📱 Iniciando servidor de desarrollo para Expo Go..."
        echo ""
        echo "📋 Instrucciones:"
        echo "1. Descarga Expo Go en tu dispositivo"
        echo "2. Escanea el QR que aparecerá"
        echo "3. ¡Listo para probar!"
        echo ""
        echo "🔗 Enlaces para descargar Expo Go:"
        echo "iOS: https://apps.apple.com/app/expo-go/id982107779"
        echo "Android: https://play.google.com/store/apps/details?id=host.exp.exponent"
        echo ""
        npx expo start
        ;;
    2)
        echo "🔨 Creando build de desarrollo..."
        echo ""
        echo "📋 Instrucciones:"
        echo "1. Se creará un archivo APK/IPA"
        echo "2. Compártelo con los testers"
        echo "3. Instálalo en sus dispositivos"
        echo ""
        read -p "¿Quieres crear para iOS o Android? (ios/android): " platform
        npx expo build:$platform --type development
        ;;
    3)
        echo "🏭 Creando build de producción..."
        echo ""
        echo "📋 Instrucciones:"
        echo "1. Se creará un archivo optimizado"
        echo "2. Listo para distribución"
        echo ""
        read -p "¿Quieres crear para iOS o Android? (ios/android): " platform
        npx expo build:$platform --type production
        ;;
    *)
        echo "❌ Opción inválida"
        exit 1
        ;;
esac

echo ""
echo "✅ ¡Despliegue completado!"
echo ""
echo "📝 Recuerda:"
echo "- Compartir el README_TESTING.md con los testers"
echo "- Usar el formulario FEEDBACK_FORM.md para recopilar feedback"
echo "- Documentar cualquier bug encontrado"
echo ""
echo "🦎 ¡Buena suerte con el testing! ✨" 