import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, Modal, TextInput, useColorScheme, Alert } from 'react-native';
import { useState } from 'react';
import { Colors } from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';
import { Svg, Circle } from 'react-native-svg';
import { useRef } from 'react';
import { useTasks } from '../../context/TasksContext';

const MOTIVATIONS = [
  '¡Hoy es un gran día para avanzar! 🌞',
  'Recuerda: cada pequeño paso cuenta. 🐢',
  '¡Tú puedes con todo! 💪',
  'Hazlo por tu ajolote 🦎',
  'La constancia es la clave del éxito. 💪'
];

const initialTasks: Task[] = [
  { id: '1', title: 'Tarea de ejemplo 1', completed: false },
  { id: '2', title: 'Tarea de ejemplo 2', completed: false },
];

type Task = { id: string; title: string; completed?: boolean };

export default function TasksScreen() {
  const { tasks, addTask, editTask, deleteTask, toggleCompleteTask } = useTasks();
  const [modalVisible, setModalVisible] = useState(false);
  const [taskInput, setTaskInput] = useState('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const motivation = MOTIVATIONS[Math.floor(Math.random() * MOTIVATIONS.length)];
  const [addPressed, setAddPressed] = useState(false);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  const systemColorScheme = useColorScheme();
  const isDark = systemColorScheme === 'dark';
  const palette = isDark ? Colors.dark : Colors;

  const TASKS_KEY = 'ajolote_tasks';

  // Elimina el estado local de tasks y toda la lógica de persistencia
  // useEffect(() => {
  //   (async () => {
  //     const saved = await AsyncStorage.getItem(TASKS_KEY);
  //     if (saved) setTasks(JSON.parse(saved));
  //   })();
  // }, []);

  // useEffect(() => {
  //   AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  // }, [tasks]);

  // useEffect(() => {
  //   AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  // }, []);

  const openAddModal = () => {
    setEditingTask(null);
    setTaskInput('');
    setModalVisible(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setTaskInput(task.title);
    setModalVisible(true);
  };

  const handleSaveTask = () => {
    if (taskInput.trim() === '') return;
    if (editingTask) {
      editTask(editingTask.id, taskInput);
    } else {
      addTask(taskInput);
    }
    setModalVisible(false);
    setTaskInput('');
    setEditingTask(null);
  };

  const handleDeleteTask = (id: string) => {
    Alert.alert(
      'Eliminar tarea',
      '¿Estás seguro de que quieres eliminar esta tarea?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => deleteTask(id) }
      ]
    );
  };

  // Reemplaza setTasks por las funciones del contexto en agregar, editar, eliminar, completar
  // const toggleCompleteTask = (id: string) => {
  //   setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  // };

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const progress = totalCount > 0 ? completedCount / totalCount : 0;
  const circleSize = 32;
  const strokeWidth = 4;
  const radius = (circleSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressStroke = circumference * (1 - progress);

  return (
    <View style={[styles.container, { backgroundColor: palette.background }] }>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 48, marginBottom: 8 }}>
        <Text style={[styles.title, { color: palette.text, marginTop: 0, marginBottom: 0 }]}>Tareas de hoy</Text>
        {totalCount > 0 && (
          <View style={{ marginLeft: 12 }}>
            <Svg width={circleSize} height={circleSize}>
              <Circle
                cx={circleSize / 2}
                cy={circleSize / 2}
                r={radius}
                stroke={isDark ? '#393C43' : '#E7DFD6'}
                strokeWidth={strokeWidth}
                fill="none"
              />
              <Circle
                cx={circleSize / 2}
                cy={circleSize / 2}
                r={radius}
                stroke={palette.primary}
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={progressStroke}
                strokeLinecap="round"
                rotation="-90"
                origin={`${circleSize / 2}, ${circleSize / 2}`}
              />
            </Svg>
            <View style={{ position: 'absolute', top: 0, left: 0, width: circleSize, height: circleSize, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: palette.primary, fontWeight: 'bold', fontSize: 12 }}>{`${completedCount}/${totalCount}`}</Text>
            </View>
          </View>
        )}
      </View>
      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          const expanded = expandedTaskId === item.id;
          return (
            <Animated.View
              entering={FadeIn.duration(350)}
              exiting={FadeOut.duration(350)}
              layout={Layout.springify()}
              style={[
                styles.taskItem,
                { 
                  backgroundColor: isDark ? '#393C43' : '#E3E6EA',
                  borderRadius: 24,
                  shadowColor: isDark ? '#000' : '#aaa',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.12,
                  shadowRadius: 12,
                  boxShadow: isDark
                    ? '0px 4px 16px rgba(0,0,0,0.18)'
                    : '0px 4px 16px rgba(90,120,147,0.10)'
                }
              ]}
            >
              <TouchableOpacity onPress={() => setExpandedTaskId(expanded ? null : item.id)} style={{ flex: 1 }} activeOpacity={0.85}>
                <Text
                  style={[
                    styles.taskText,
                    { color: palette.text },
                    item.completed && { textDecorationLine: 'line-through', color: palette.textSecondary, opacity: 0.6, transitionProperty: 'all', transitionDuration: '0.3s' }
                  ]}
                  numberOfLines={expanded ? undefined : 2}
                  ellipsizeMode={expanded ? undefined : 'tail'}
                >
                  {item.title}
                </Text>
              </TouchableOpacity>
              <View style={styles.taskActions}>
                <TouchableOpacity onPress={() => toggleCompleteTask(item.id)} style={styles.checkButton}>
                  <Ionicons
                    name={item.completed ? 'checkmark-circle' : 'ellipse-outline'}
                    size={26}
                    color={item.completed ? palette.primary : palette.textSecondary}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => openEditModal(item)}>
                  <Ionicons name="pencil-outline" size={22} color={palette.primary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteTask(item.id)}>
                  <Ionicons name="trash-outline" size={22} color={isDark ? '#C98F8F' : '#D36A6A'} />
                </TouchableOpacity>
              </View>
            </Animated.View>
          );
        }}
        ListEmptyComponent={<Text style={[styles.empty, { color: palette.textSecondary } ]}>¡Sin tareas pendientes! Tu ajolote está feliz 🥳</Text>}
        style={{ width: '100%' }}
        contentContainerStyle={{ paddingBottom: 220 }}
      />
      <View style={styles.ajoloteContainer}>
        <Image source={require('../../assets/images/axofi-logo-v1.png')} style={styles.ajoloteImage} resizeMode="contain" />
      </View>
      <Text style={[styles.motivation, { color: palette.primary } ]}>{motivation}</Text>
      <TouchableOpacity
        style={[
          styles.addButton,
          {
            backgroundColor: addPressed
              ? (isDark ? '#7CA49A' : '#C4D6CE')
              : palette.primary
          }
        ]}
        onPress={openAddModal}
        onPressIn={() => setAddPressed(true)}
        onPressOut={() => setAddPressed(false)}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={32} color={palette.onPrimary} />
        <Text style={[styles.addButtonText, { color: palette.onPrimary } ]}>Agregar tarea</Text>
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: palette.card }] }>
            <Text style={[styles.modalTitle, { color: palette.text } ]}>{editingTask ? 'Editar tarea' : 'Nueva tarea'}</Text>
            <TextInput
              style={[styles.modalInput, { backgroundColor: palette.background, color: palette.text, borderColor: palette.accent }]}
              placeholder="Descripción de la tarea"
              placeholderTextColor={palette.textSecondary}
              value={taskInput}
              onChangeText={setTaskInput}
              autoFocus
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: palette.primary }]} onPress={handleSaveTask}>
                <Text style={[styles.modalButtonText, { color: palette.onPrimary } ]}>{editingTask ? 'Guardar' : 'Agregar'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: isDark ? '#333' : '#eee' }]} onPress={() => setModalVisible(false)}>
                <Text style={[styles.modalButtonText, { color: palette.primary }]}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 24,
    backgroundColor: Colors.background,
  },
  title: {
    fontFamily: 'Nunito-Bold',
    fontSize: 28,
    marginTop: 24,
    marginBottom: 16,
    color: Colors.text,
  },
  taskItem: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskText: {
    fontFamily: 'Nunito',
    fontSize: 18,
    color: Colors.text,
    flex: 1,
    overflow: 'hidden',
  },
  taskActions: {
    flexDirection: 'row',
    gap: 12,
    marginLeft: 12,
  },
  empty: {
    color: Colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 32,
  },
  ajoloteContainer: {
    marginVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ajoloteImage: {
    width: 140,
    height: 140,
    marginBottom: 8,
  },
  motivation: {
    fontFamily: 'Nunito',
    fontSize: 18,
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: 24,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 32,
    marginTop: 8,
  },
  addButtonText: {
    color: Colors.onPrimary,
    fontFamily: 'Nunito-Bold',
    fontSize: 18,
    marginLeft: 10,
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
  modalInput: {
    width: '100%',
    backgroundColor: Colors.background,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.accent,
    marginBottom: 18,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  modalButtonText: {
    color: Colors.onPrimary,
    fontFamily: 'Nunito-Bold',
    fontSize: 16,
  },
  checkButton: {
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 