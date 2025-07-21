import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { Colors } from '../../constants/Colors';

export default function PetScreen() {
  const systemColorScheme = useColorScheme();
  const isDark = systemColorScheme === 'dark';
  const palette = isDark ? Colors.dark : Colors;

  return (
    <View style={[styles.container, { backgroundColor: palette.background }] }>
      <Text style={[styles.title, { color: palette.text } ]}>Ajolote</Text>
      {/* Aquí irá la animación y estado del ajolote */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  title: {
    fontFamily: 'Nunito-Bold',
    fontSize: 28,
    color: Colors.text,
    marginBottom: 24,
  },
}); 