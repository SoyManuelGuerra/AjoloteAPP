import { Tabs } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { Colors } from '../../constants/Colors';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';

export default function TabLayout() {
  const systemColorScheme = useColorScheme();
  const isDark = systemColorScheme === 'dark';
  const palette = isDark ? Colors.dark : Colors;
  const [addPressed, setAddPressed] = useState(false);
  const router = useRouter();

  const handleAddTask = () => {
    // Navegar a la pantalla de tareas con parámetro para abrir modal
    router.push('/(tabs)/tasks?openModal=true');
  };

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: isDark ? '#23242A' : '#F5E9DA',
          borderTopWidth: 0,
          elevation: 0,
          height: 70, // Reducido de 90 a 70 para menos altura
          paddingBottom: 8, // Reducido de 10 a 8
        },
      }}
    >
      <Tabs.Screen
        name="tasks"
        options={{
          title: "Tareas",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="checkmark-done-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="pet"
        options={{
          title: "Axofi",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="paw-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="add-task"
        options={{
          title: "",
          headerShown: false,
          tabBarButton: (props) => (
            <TouchableOpacity
              style={[
                styles.addButton,
                {
                  backgroundColor: addPressed ? (isDark ? '#7CA49A' : '#C4D6CE') : palette.primary,
                  transform: [{ scale: addPressed ? 0.95 : 1 }],
                }
              ]}
              onPress={handleAddTask}
              onPressIn={() => setAddPressed(true)}
              onPressOut={() => setAddPressed(false)}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={32} color={palette.onPrimary} />
            </TouchableOpacity>
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            handleAddTask();
          },
        }}
      />
      <Tabs.Screen
        name="rewards"
        options={{
          title: "Recompensas",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="gift-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  addButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '-20%', // Cambiado a porcentaje para mejor responsividad
    alignSelf: 'center', // Centra el botón horizontalmente
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});