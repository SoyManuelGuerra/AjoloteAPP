import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, Modal, TextInput, useColorScheme, Alert } from 'react-native';
import { useState , useEffect , useRef } from 'react';
import { Colors } from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Svg, Circle, Rect } from 'react-native-svg';
import { useTasks } from '../../context/TasksContext';
import { usePoints } from '../../context/PointsContext';
import { LinearGradient } from 'expo-linear-gradient';

// Quitar importación de reanimated y AnimatedRect
// import Animated, { FadeIn, FadeOut, Layout, useSharedValue, useAnimatedProps, withTiming } from 'react-native-reanimated';
// import { Svg, Circle, Rect } from 'react-native-svg';

const MOTIVATIONS = [
  '¡Hoy es un gran día para avanzar! 🌞',
  'Recuerda: cada pequeño paso cuenta. 🐢',
  '¡Tú puedes con todo! 💪',
  'Hazlo por tu ajolote 🦎',
  'La constancia es la clave del éxito. 💪'
];

const PRIORITY_OPTIONS = [
  { value: 'high', label: 'Alta' },
  { value: 'medium', label: 'Media' },
  { value: 'low', label: 'Baja' },
];
 
const initialTasks: Task[] = [
  { id: '1', title: 'Tarea de ejemplo 1', completed: false },
  { id: '2', title: 'Tarea de ejemplo 2', completed: false },
];

type Task = { id: string; title: string; completed?: boolean; priority?: 'high' | 'medium' | 'low' };

// Función para ordenar tareas por prioridad
function sortTasksByPriority(tasks: Task[]): Task[] {
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  return [...tasks].sort((a, b) => {
    const pa = priorityOrder[a.priority || 'medium'];
    const pb = priorityOrder[b.priority || 'medium'];
    return pa - pb;
  });
}

export default function TasksScreen() {
  const { tasks, addTask, editTask, deleteTask, toggleCompleteTask } = useTasks();
  const { addPoints } = usePoints();
  const [modalVisible, setModalVisible] = useState(false);
  const [taskInput, setTaskInput] = useState('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const motivation = MOTIVATIONS[Math.floor(Math.random() * MOTIVATIONS.length)];
  const [addPressed, setAddPressed] = useState(false);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [taskPriority, setTaskPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [menuTaskId, setMenuTaskId] = useState<string | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  const systemColorScheme = useColorScheme();
  const isDark = systemColorScheme === 'dark';
  const palette = isDark ? Colors.dark : Colors;
  const gradientColors: [string, string, string] = isDark
    ? ['#2D2F36', '#3A3D45', '#484C55']
    : ['#F2ECE6', '#E7DFD6', '#DDD2C4'];

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
    setTaskPriority('medium');
    setModalVisible(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setTaskInput(task.title);
    setTaskPriority(task.priority || 'medium');
    setModalVisible(true);
  };

  const handleSaveTask = () => {
    if (taskInput.trim() === '') return;
    if (editingTask) {
      editTask(editingTask.id, taskInput, taskPriority);
    } else {
      addTask(taskInput, taskPriority);
    }
    setModalVisible(false);
    setTaskInput('');
    setEditingTask(null);
    setTaskPriority('medium');
  };

  const handleDeleteTask = (id: string) => {
    setTaskToDelete(id);
    setDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete);
      setDeleteModalVisible(false);
      setTaskToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDeleteModalVisible(false);
    setTaskToDelete(null);
  };

  // Reemplaza setTasks por las funciones del contexto en agregar, editar, eliminar, completar
  // const toggleCompleteTask = (id: string) => {
  //   setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  // };

  // Nueva función para manejar el toggle y sumar puntos
  const handleToggleCompleteTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task && !task.completed) {
      addPoints(10); // Suma 10 puntos por tarea completada
    }
    toggleCompleteTask(id);
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const progress = totalCount > 0 ? completedCount / totalCount : 0;
  // Ajustar tamaño del círculo según cantidad de dígitos
  const maxDigits = Math.max(completedCount.toString().length, totalCount.toString().length);
  const circleSize = maxDigits >= 2 ? 44 : 32;
  const fontSize = maxDigits >= 2 ? 13 : 15;
  const strokeWidth = 4;
  const radius = (circleSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressStroke = circumference * (1 - progress);

  // Eliminar lógica de animación
  // const progressAnim = useSharedValue(0);
  // useEffect(() => {
  //   progressAnim.value = withTiming(220 * progress, { duration: 600 });
  // }, [progress]);
  // const animatedProps = useAnimatedProps(() => ({ width: progressAnim.value }));

  return (
    <View style={[styles.container, { backgroundColor: palette.background }] }>
      <LinearGradient
        colors={gradientColors}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 48, marginBottom: 8 }}>
        <Text style={[styles.title, { color: palette.text, marginTop: 0, marginBottom: 0 }]}>Tareas de hoy</Text>
      </View>
      <FlatList
        data={sortTasksByPriority(tasks)}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          const expanded = expandedTaskId === item.id;
          return (
            <View
              style={[styles.taskItem,
                {
                  backgroundColor: isDark ? '#393C43' : '#FFF8F1',
                  borderRadius: 24,
                  shadowColor: isDark ? '#000' : '#B08B5E', // sombra más cálida en claro
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.18,
                  shadowRadius: 18,
                  elevation: 8,
                  borderWidth: 1.5,
                  borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(176,139,94,0.18)',
                }
              ]}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, marginBottom: 4 }}>
                <TouchableOpacity onPress={() => handleToggleCompleteTask(item.id)} style={styles.checkButton} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Ionicons
                    name={item.completed ? 'checkmark-circle' : 'checkmark-circle-outline'}
                    size={26}
                    color={item.completed ? palette.primary : palette.textSecondary}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setExpandedTaskId(expanded ? null : item.id)} style={{ flex: 1 }} activeOpacity={0.85}>
                  <Text
                    style={[
                      styles.taskText,
                      { color: palette.text },
                      item.completed && { textDecorationLine: 'line-through', color: '#999', opacity: 1 }
                    ]}
                    numberOfLines={expanded ? undefined : 2}
                    ellipsizeMode="tail"
                  >
                    {item.title}
                  </Text>
                </TouchableOpacity>
                <View style={{ marginLeft: 8 }}>
                  <View style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor:
                      item.priority === 'high' ? 'rgba(255, 99, 71, 0.18)'
                      : item.priority === 'medium' ? 'rgba(255, 205, 86, 0.18)'
                      : 'rgba(72, 199, 142, 0.18)',
                    borderWidth: 1.5,
                    borderColor:
                      item.priority === 'high' ? 'rgba(255, 99, 71, 0.5)'
                      : item.priority === 'medium' ? 'rgba(255, 205, 86, 0.5)'
                      : 'rgba(72, 199, 142, 0.5)',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    <Text style={{
                      color:
                        item.priority === 'high' ? 'rgba(255, 99, 71, 0.95)'
                        : item.priority === 'medium' ? 'rgba(255, 205, 86, 0.95)'
                        : 'rgba(72, 199, 142, 0.95)',
                      fontWeight: 'bold',
                      fontSize: 16,
                      lineHeight: 20,
                    }}>!</Text>
                  </View>
                </View>
              </View>
              <View style={styles.taskActions}>
                <TouchableOpacity onPress={() => setMenuTaskId(item.id)}>
                  <Text style={{ fontSize: 26, color: palette.textSecondary, fontWeight: 'bold', paddingHorizontal: 2 }}>⋮</Text>
                </TouchableOpacity>
              </View>
              {/* Menú modal de opciones */}
              <Modal
                visible={menuTaskId === item.id}
                transparent
                animationType="fade"
                onRequestClose={() => setMenuTaskId(null)}
              >
                <TouchableOpacity style={styles.menuOverlay} activeOpacity={1} onPress={() => setMenuTaskId(null)}>
                  <View style={[styles.menuContainer, { backgroundColor: palette.card }] }>
                    <TouchableOpacity style={styles.menuOption} onPress={() => { setMenuTaskId(null); openEditModal(item); }}>
                      <Ionicons name="pencil-outline" size={20} color={palette.primary} style={{ marginRight: 8 }} />
                      <Text style={{ color: palette.text, fontSize: 16 }}>Editar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuOption} onPress={() => { setMenuTaskId(null); handleDeleteTask(item.id); }}>
                      <Ionicons name="trash-outline" size={20} color={isDark ? '#C98F8F' : '#D36A6A'} style={{ marginRight: 8 }} />
                      <Text style={{ color: isDark ? '#C98F8F' : '#D36A6A', fontSize: 16 }}>Eliminar</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              </Modal>
            </View>
          );
        }}
        ListEmptyComponent={<Text style={[styles.empty, { color: palette.textSecondary } ]}>¡Sin tareas pendientes! Tu ajolote está feliz 🥳</Text>}
        style={{ width: '100%' }}
        contentContainerStyle={{ paddingBottom: 220 }}
      />
      <View style={{ alignItems: 'center', width: '100%', marginTop: 32, marginBottom: 8 }}>
        <View style={[
          styles.progressBox,
          { backgroundColor: palette.card, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4, marginBottom: 0, marginTop: 0, width: 240, alignSelf: 'center' }
        ]}>
          <Text style={[styles.evolutionTitle, { color: palette.primary, marginBottom: 2, fontSize: 15 }]}>Evolución diaria</Text>
          {/* Reemplazar barra animada por barra estática */}
          <View style={{ width: 220, height: 22, marginTop: 2, marginBottom: 2, justifyContent: 'center' }}>
            <Svg width={220} height={22}>
              <Rect x={0} y={0} width={220} height={22} rx={11} fill={isDark ? '#393C43' : '#E7DFD6'} />
              <Rect
                x={0}
                y={0}
                width={220 * progress}
                height={22}
                rx={11}
                fill={palette.primary}
              />
            </Svg>
            <View style={{ position: 'absolute', left: 0, top: 0, width: 220, height: 22, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: palette.text, fontWeight: 'bold', fontSize: 13 }}>{`${completedCount}/${totalCount} tareas`}</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={{ alignItems: 'center', marginTop: 32, marginBottom: 8 }}>
        <Text style={[styles.motivation, { color: palette.primary } ]}>{motivation}</Text>
      </View>
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
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 16, width: '100%' }}>
              {PRIORITY_OPTIONS.map(opt => (
                <TouchableOpacity
                  key={opt.value}
                  style={{
                    flex: 1,
                    minWidth: 0,
                    backgroundColor: taskPriority === opt.value ? (opt.value === 'high' ? '#ffb3b3' : opt.value === 'medium' ? '#fff6b3' : '#b3ffb3') : 'transparent',
                    borderRadius: 16,
                    paddingVertical: 8,
                    paddingHorizontal: 0,
                    marginHorizontal: 4,
                    borderWidth: taskPriority === opt.value ? 2 : 1,
                    borderColor: taskPriority === opt.value ? '#888' : '#ccc',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={() => setTaskPriority(opt.value as 'high' | 'medium' | 'low')}
                >
                  <View style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor:
                      opt.value === 'high' ? 'rgba(255, 99, 71, 0.18)'
                      : opt.value === 'medium' ? 'rgba(255, 205, 86, 0.18)'
                      : 'rgba(72, 199, 142, 0.18)',
                    borderWidth: 1.5,
                    borderColor:
                      opt.value === 'high' ? 'rgba(255, 99, 71, 0.5)'
                      : opt.value === 'medium' ? 'rgba(255, 205, 86, 0.5)'
                      : 'rgba(72, 199, 142, 0.5)',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    <Text style={{
                      color:
                        opt.value === 'high' ? 'rgba(255, 99, 71, 0.95)'
                        : opt.value === 'medium' ? 'rgba(255, 205, 86, 0.95)'
                        : 'rgba(72, 199, 142, 0.95)',
                      fontWeight: 'bold',
                      fontSize: 16,
                      lineHeight: 20,
                    }}>!</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            <View style={{ alignItems: 'center', marginBottom: 12 }}>
              <Text style={{
                fontSize: 16,
                fontWeight: 'bold',
                color:
                  taskPriority === 'high' ? 'rgba(255, 99, 71, 0.95)'
                  : taskPriority === 'medium' ? 'rgba(255, 205, 86, 0.95)'
                  : 'rgba(72, 199, 142, 0.95)',
              }}>
                {taskPriority === 'high' ? 'Prioridad alta'
                  : taskPriority === 'medium' ? 'Prioridad media'
                  : 'Prioridad baja'}
              </Text>
            </View>
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
      {/* Modal de confirmación de eliminación */}
      <Modal
        visible={deleteModalVisible}
        animationType="slide"
        transparent
        onRequestClose={cancelDelete}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: palette.card }] }>
            <Text style={[styles.modalTitle, { color: palette.text } ]}>¿Eliminar esta tarea?</Text>
            <Text style={[styles.modalText, { color: palette.textSecondary } ]}>
              No te preocupes, siempre puedes crear una nueva 😅
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: isDark ? '#C98F8F' : '#D36A6A' }]} onPress={confirmDelete}>
                <Text style={[styles.modalButtonText, { color: '#FFF' } ]}>Eliminar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: isDark ? '#333' : '#eee' }]} onPress={cancelDelete}>
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
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    marginTop: 10,
    marginHorizontal: 0,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(120,120,120,0.08)',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
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
  modalText: {
    fontFamily: 'Nunito',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  checkButton: {
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBox: {
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  evolutionTitle: {
    fontFamily: 'Nunito-Bold',
    fontSize: 18,
    marginBottom: 8,
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    minWidth: 160,
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 0,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    alignItems: 'stretch',
  },
  menuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.07)',
  },
}); 