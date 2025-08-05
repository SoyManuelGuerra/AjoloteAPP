import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, Modal, TextInput, useColorScheme, Alert } from 'react-native';
import { useState , useEffect , useRef } from 'react';
import { Colors } from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Svg, Circle, Rect } from 'react-native-svg';
import { useTasks, Task } from '../../context/TasksContext';
import { usePoints } from '../../context/PointsContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';

// Quitar importación de reanimated y AnimatedRect
// import Animated, { FadeIn, FadeOut, Layout, useSharedValue, useAnimatedProps, withTiming } from 'react-native-reanimated';
// import { Svg, Circle, Rect } from 'react-native-svg';



const PRIORITY_OPTIONS = [
  { value: 'high', label: 'Alta' },
  { value: 'medium', label: 'Media' },
  { value: 'low', label: 'Baja' },
];

const DUE_DATE_OPTIONS = [
  { value: 'today', label: 'Hoy', date: new Date() },
  { value: 'tomorrow', label: 'Mañana', date: new Date(Date.now() + 24 * 60 * 60 * 1000) },
  { value: 'this-week', label: 'Esta semana', date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
  { value: 'next-week', label: 'Próxima semana', date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) },
  { value: 'later', label: 'Más adelante', date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
];
 
const initialTasks: Task[] = [
  { id: '1', title: 'Tarea de ejemplo 1', completed: false },
  { id: '2', title: 'Tarea de ejemplo 2', completed: false },
];



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
  const { tasks, completedTasks, addTask, editTask, deleteTask, toggleCompleteTask, moveToCompleted, restoreTask, deleteCompletedTask } = useTasks();
  const { addPoints } = usePoints();
  const [modalVisible, setModalVisible] = useState(false);
  const [taskInput, setTaskInput] = useState('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [addPressed, setAddPressed] = useState(false);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [taskPriority, setTaskPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [taskDueDate, setTaskDueDate] = useState<string>('today');
  const [menuTaskId, setMenuTaskId] = useState<string | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [helpModalVisible, setHelpModalVisible] = useState(false);
  const [completeModalVisible, setCompleteModalVisible] = useState(false);
  const [taskToComplete, setTaskToComplete] = useState<Task | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    today: true,
    tomorrow: true,
    thisWeek: true,
    nextWeek: true,
    later: true,
    noDate: true,
  });
  const params = useLocalSearchParams();
  const router = useRouter();

  const systemColorScheme = useColorScheme();
  const isDark = systemColorScheme === 'dark';
  const palette = isDark ? Colors.dark : Colors;
  const gradientColors: [string, string, string] = isDark
    ? ['#2D2F36', '#3A3D45', '#484C55']
    : ['#F2ECE6', '#E7DFD6', '#DDD2C4'];

  const TASKS_KEY = 'ajolote_tasks';

  // Abrir modal automáticamente si se recibe el parámetro
  useEffect(() => {
    if (params.openModal === 'true') {
      // Abrir modal directamente sin delay
      openAddModal();
      // Resetear el parámetro para que pueda detectar cambios futuros
      router.setParams({ openModal: 'false' });
    }
  }, [params.openModal]);

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
    setTaskDueDate('today');
    setModalVisible(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setTaskInput(task.title);
    setTaskPriority(task.priority || 'medium');
    setTaskDueDate(task.dueDate ? getDueDateCategory(task.dueDate) : 'today');
    setModalVisible(true);
  };

  // Función para obtener la categoría de fecha basada en la fecha de vencimiento
  const getDueDateCategory = (dueDate: string): string => {
    const taskDate = new Date(dueDate);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const thisWeek = new Date(today);
    thisWeek.setDate(thisWeek.getDate() + 7);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 14);

    if (taskDate.toDateString() === today.toDateString()) return 'today';
    if (taskDate.toDateString() === tomorrow.toDateString()) return 'tomorrow';
    if (taskDate <= thisWeek) return 'this-week';
    if (taskDate <= nextWeek) return 'next-week';
    return 'later';
  };

  // Función para organizar tareas por fecha
  const getTasksByDate = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const thisWeek = new Date(today);
    thisWeek.setDate(thisWeek.getDate() + 7);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 14);

    const todayTasks = tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return taskDate.toDateString() === today.toDateString();
    });

    const tomorrowTasks = tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return taskDate.toDateString() === tomorrow.toDateString();
    });

    const thisWeekTasks = tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return taskDate > tomorrow && taskDate <= thisWeek;
    });

    const nextWeekTasks = tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return taskDate > thisWeek && taskDate <= nextWeek;
    });

    const laterTasks = tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return taskDate > nextWeek;
    });

    const noDateTasks = tasks.filter(task => !task.dueDate);

    return {
      today: sortTasksByPriority(todayTasks),
      tomorrow: sortTasksByPriority(tomorrowTasks),
      thisWeek: sortTasksByPriority(thisWeekTasks),
      nextWeek: sortTasksByPriority(nextWeekTasks),
      later: sortTasksByPriority(laterTasks),
      noDate: sortTasksByPriority(noDateTasks)
    };
  };

  // Función para renderizar un item de tarea
  const renderTaskItem = (item: Task) => {
    const expanded = expandedTaskId === item.id;
    return (
      <View
        key={item.id}
        style={[styles.taskItem,
          {
            backgroundColor: palette.cardWarm,
            borderRadius: 32,
            shadowColor: isDark ? '#000' : '#B08B5E',
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.25,
            shadowRadius: 24,
            elevation: 12,
            borderWidth: 1.5,
            borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(176,139,94,0.18)',
          }
        ]}
      >
        <TouchableOpacity 
          onPress={() => setExpandedTaskId(expanded ? null : item.id)}
          onLongPress={() => setMenuTaskId(item.id)}
          style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
          activeOpacity={0.7}
          delayLongPress={500}
        >
          <TouchableOpacity onPress={() => handleToggleCompleteTask(item.id)} style={styles.checkButton} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons
              name={item.completed ? 'checkmark-circle' : 'checkmark-circle-outline'}
              size={26}
              color={item.completed ? palette.primary : palette.textSecondary}
            />
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 8 }}>
            <Text
              style={[
                styles.taskText,
                { color: palette.text },
                item.completed && { textDecorationLine: 'line-through', color: '#999', opacity: 1 }
              ]}
              numberOfLines={expanded ? undefined : 1}
              ellipsizeMode="tail"
            >
              {item.title}
            </Text>
          </View>
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
        </TouchableOpacity>
        {/* Menú modal de opciones */}
        <Modal
          visible={menuTaskId === item.id}
          transparent
          animationType="fade"
          onRequestClose={() => setMenuTaskId(null)}
        >
          <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setMenuTaskId(null)}>
            <View style={[styles.modalContent, { backgroundColor: palette.cardWarm }]}>
              <Text style={[styles.modalTitle, { color: palette.text }]}>Opciones de tarea</Text>
              <TouchableOpacity 
                style={[styles.menuOption, { borderBottomColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }]} 
                onPress={() => { setMenuTaskId(null); openEditModal(item); }}
              >
                <Ionicons name="pencil-outline" size={24} color={palette.primary} style={{ marginRight: 12 }} />
                <Text style={{ color: palette.text, fontSize: 18, fontWeight: '500' }}>Editar tarea</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.menuOption, { borderBottomWidth: 0 }]} 
                onPress={() => { setMenuTaskId(null); handleDeleteTask(item.id); }}
              >
                <Ionicons name="trash-outline" size={24} color={isDark ? '#C98F8F' : '#D36A6A'} style={{ marginRight: 12 }} />
                <Text style={{ color: isDark ? '#C98F8F' : '#D36A6A', fontSize: 18, fontWeight: '500' }}>Eliminar tarea</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    );
  };

  const handleSaveTask = () => {
    if (taskInput.trim() === '') return;
    
    const selectedDateOption = DUE_DATE_OPTIONS.find(option => option.value === taskDueDate);
    const dueDate = selectedDateOption ? selectedDateOption.date.toISOString() : undefined;
    
    if (editingTask) {
      editTask(editingTask.id, taskInput, taskPriority, dueDate);
    } else {
      addTask(taskInput, taskPriority, dueDate);
    }
    setModalVisible(false);
    setTaskInput('');
    setEditingTask(null);
    setTaskPriority('medium');
    setTaskDueDate('today');
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

  const handleCompleteTask = (task: Task) => {
    setTaskToComplete(task);
    setCompleteModalVisible(true);
  };

  const confirmComplete = () => {
    if (taskToComplete) {
      addPoints(10); // Suma 10 puntos por tarea completada
      moveToCompleted(taskToComplete.id);
      setCompleteModalVisible(false);
      setTaskToComplete(null);
    }
  };

  const cancelComplete = () => {
    setCompleteModalVisible(false);
    setTaskToComplete(null);
  };

  const toggleSection = (sectionKey: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  // Reemplaza setTasks por las funciones del contexto en agregar, editar, eliminar, completar
  // const toggleCompleteTask = (id: string) => {
  //   setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  // };

  // Nueva función para manejar el toggle y sumar puntos
  const handleToggleCompleteTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task && !task.completed) {
      handleCompleteTask(task);
    } else {
      toggleCompleteTask(id);
    }
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
        <Text style={[styles.title, { color: palette.text, marginTop: 0, marginBottom: 0 }]}>Mis Tareas</Text>
        <TouchableOpacity 
          style={{ marginLeft: 8, padding: 4 }}
          onPress={() => setHelpModalVisible(true)}
        >
          <Ionicons name="information-circle-outline" size={20} color={palette.textSecondary} />
        </TouchableOpacity>
      </View>
      <View style={{ width: '100%' }}>
        {(() => {
          const tasksByDate = getTasksByDate();
          const hasAnyTasks = Object.values(tasksByDate).some(tasks => tasks.length > 0);
          
          if (!hasAnyTasks) {
            return <Text style={[styles.empty, { color: palette.textSecondary }]}>¡Sin tareas pendientes! Tu ajolote está feliz 🥳</Text>;
          }

          return (
            <View style={{ paddingBottom: 20 }}>
              {/* Tareas de hoy */}
              {tasksByDate.today.length > 0 && (
                <View style={{ marginBottom: 24 }}>
                  <TouchableOpacity 
                    style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}
                    onPress={() => toggleSection('today')}
                  >
                    <Text style={[styles.dateSectionTitle, { color: palette.text }]}>🗓️ Hoy ({tasksByDate.today.length})</Text>
                    <Ionicons 
                      name={expandedSections.today ? 'chevron-up' : 'chevron-down'} 
                      size={20} 
                      color={palette.textSecondary} 
                      style={{ marginLeft: 8 }}
                    />
                  </TouchableOpacity>
                  {expandedSections.today && tasksByDate.today.map(item => renderTaskItem(item))}
                </View>
              )}

              {/* Tareas de mañana */}
              {tasksByDate.tomorrow.length > 0 && (
                <View style={{ marginBottom: 24 }}>
                  <TouchableOpacity 
                    style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}
                    onPress={() => toggleSection('tomorrow')}
                  >
                    <Text style={[styles.dateSectionTitle, { color: palette.text }]}>🗓️ Mañana ({tasksByDate.tomorrow.length})</Text>
                    <Ionicons 
                      name={expandedSections.tomorrow ? 'chevron-up' : 'chevron-down'} 
                      size={20} 
                      color={palette.textSecondary} 
                      style={{ marginLeft: 8 }}
                    />
                  </TouchableOpacity>
                  {expandedSections.tomorrow && tasksByDate.tomorrow.map(item => renderTaskItem(item))}
                </View>
              )}

              {/* Tareas de esta semana */}
              {tasksByDate.thisWeek.length > 0 && (
                <View style={{ marginBottom: 24 }}>
                  <TouchableOpacity 
                    style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}
                    onPress={() => toggleSection('thisWeek')}
                  >
                    <Text style={[styles.dateSectionTitle, { color: palette.text }]}>📅 Esta semana ({tasksByDate.thisWeek.length})</Text>
                    <Ionicons 
                      name={expandedSections.thisWeek ? 'chevron-up' : 'chevron-down'} 
                      size={20} 
                      color={palette.textSecondary} 
                      style={{ marginLeft: 8 }}
                    />
                  </TouchableOpacity>
                  {expandedSections.thisWeek && tasksByDate.thisWeek.map(item => renderTaskItem(item))}
                </View>
              )}

              {/* Tareas de próxima semana */}
              {tasksByDate.nextWeek.length > 0 && (
                <View style={{ marginBottom: 24 }}>
                  <TouchableOpacity 
                    style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}
                    onPress={() => toggleSection('nextWeek')}
                  >
                    <Text style={[styles.dateSectionTitle, { color: palette.text }]}>📅 Próxima semana ({tasksByDate.nextWeek.length})</Text>
                    <Ionicons 
                      name={expandedSections.nextWeek ? 'chevron-up' : 'chevron-down'} 
                      size={20} 
                      color={palette.textSecondary} 
                      style={{ marginLeft: 8 }}
                    />
                  </TouchableOpacity>
                  {expandedSections.nextWeek && tasksByDate.nextWeek.map(item => renderTaskItem(item))}
                </View>
              )}

              {/* Tareas más adelante */}
              {tasksByDate.later.length > 0 && (
                <View style={{ marginBottom: 24 }}>
                  <TouchableOpacity 
                    style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}
                    onPress={() => toggleSection('later')}
                  >
                    <Text style={[styles.dateSectionTitle, { color: palette.text }]}>📅 Más adelante ({tasksByDate.later.length})</Text>
                    <Ionicons 
                      name={expandedSections.later ? 'chevron-up' : 'chevron-down'} 
                      size={20} 
                      color={palette.textSecondary} 
                      style={{ marginLeft: 8 }}
                    />
                  </TouchableOpacity>
                  {expandedSections.later && tasksByDate.later.map(item => renderTaskItem(item))}
                </View>
              )}

              {/* Tareas sin fecha */}
              {tasksByDate.noDate.length > 0 && (
                <View style={{ marginBottom: 24 }}>
                  <TouchableOpacity 
                    style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}
                    onPress={() => toggleSection('noDate')}
                  >
                    <Text style={[styles.dateSectionTitle, { color: palette.textSecondary }]}>📅 Sin fecha ({tasksByDate.noDate.length})</Text>
                    <Ionicons 
                      name={expandedSections.noDate ? 'chevron-up' : 'chevron-down'} 
                      size={20} 
                      color={palette.textSecondary} 
                      style={{ marginLeft: 8 }}
                    />
                  </TouchableOpacity>
                  {expandedSections.noDate && tasksByDate.noDate.map(item => renderTaskItem(item))}
                </View>
              )}
            </View>
          );
        })()}
      </View>

      {/* Sección de tareas completadas */}
      {completedTasks.length > 0 && (
        <View style={{ width: '100%', marginTop: 24 }}>
          <TouchableOpacity 
            style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}
            onPress={() => setShowCompleted(!showCompleted)}
          >
            <Text style={[styles.dateSectionTitle, { color: palette.text }]}>
              ✅ Tareas Completadas ({completedTasks.length})
            </Text>
            <Ionicons 
              name={showCompleted ? 'chevron-up' : 'chevron-down'} 
              size={20} 
              color={palette.textSecondary} 
              style={{ marginLeft: 8 }}
            />
          </TouchableOpacity>
          
          {showCompleted && (
            <FlatList
              data={completedTasks}
              keyExtractor={item => `completed-${item.id}`}
              renderItem={({ item }) => {
                const completedDate = item.completedAt ? new Date(item.completedAt) : new Date();
                const formattedDate = completedDate.toLocaleDateString('es-ES', { 
                  day: '2-digit', 
                  month: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit'
                });
                
                return (
                  <View
                    style={[styles.completedTaskItem,
                      {
                        backgroundColor: palette.cardAccent,
                        borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(176,139,94,0.12)',
                      }
                    ]}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                      <View style={styles.checkButton}>
                        <Ionicons
                          name="checkmark-circle"
                          size={24}
                          color={palette.primary}
                        />
                      </View>
                      <View style={{ flex: 1, marginLeft: 8 }}>
                        <Text
                          style={[
                            styles.completedTaskText,
                            { color: palette.textSecondary }
                          ]}
                        >
                          {item.title}
                        </Text>
                        <Text style={[styles.completedDate, { color: palette.textSecondary }]}>
                          Completada el {formattedDate}
                        </Text>
                      </View>
                      <View style={{ flexDirection: 'row', gap: 8 }}>
                        <TouchableOpacity 
                          onPress={() => restoreTask(item.id)}
                          style={styles.actionButton}
                        >
                          <Ionicons name="refresh-outline" size={20} color={palette.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity 
                          onPress={() => deleteCompletedTask(item.id)}
                          style={styles.actionButton}
                        >
                          <Ionicons name="trash-outline" size={20} color={isDark ? '#C98F8F' : '#D36A6A'} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                );
              }}
              style={{ width: '100%' }}
              contentContainerStyle={{ paddingBottom: 120 }}
            />
          )}
        </View>
      )}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: palette.cardWarm }] }>
            <Text style={[styles.modalTitle, { color: palette.text } ]}>{editingTask ? 'Editar tarea' : 'Nueva tarea'}</Text>
            <TextInput
              style={[styles.modalInput, { backgroundColor: palette.background, color: palette.text, borderColor: palette.accent }]}
              placeholder="Descripción de la tarea"
              placeholderTextColor={palette.textSecondary}
              value={taskInput}
              onChangeText={setTaskInput}
              autoFocus
            />
            <View style={{ marginBottom: 16, width: '100%' }}>
              <Text style={[styles.modalLabel, { color: palette.text }]}>Prioridad:</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 8 }}>
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
            </View>

            <View style={{ marginBottom: 16, width: '100%' }}>
              <Text style={[styles.modalLabel, { color: palette.text }]}>Cuándo realizarla:</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 8, gap: 8 }}>
                {DUE_DATE_OPTIONS.map(opt => (
                  <TouchableOpacity
                    key={opt.value}
                    style={{
                      backgroundColor: taskDueDate === opt.value ? palette.primary : 'transparent',
                      borderRadius: 20,
                      paddingVertical: 8,
                      paddingHorizontal: 16,
                      borderWidth: 1,
                      borderColor: taskDueDate === opt.value ? palette.primary : palette.accent,
                      minWidth: 80,
                    }}
                    onPress={() => setTaskDueDate(opt.value)}
                  >
                    <Text style={{
                      color: taskDueDate === opt.value ? palette.onPrimary : palette.text,
                      fontSize: 14,
                      fontWeight: '500',
                      textAlign: 'center',
                    }}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
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
          <View style={[styles.modalContent, { backgroundColor: palette.cardWarm }] }>
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

      {/* Modal de confirmación para completar tarea */}
      <Modal
        visible={completeModalVisible}
        animationType="slide"
        transparent
        onRequestClose={cancelComplete}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: palette.cardWarm }]}>
            <Text style={[styles.modalTitle, { color: palette.text }]}>¿Completar tarea?</Text>
            <Text style={[styles.modalText, { color: palette.textSecondary }]}>
              ¿Estás seguro de que quieres marcar "{taskToComplete?.title}" como completada?
            </Text>
            <Text style={[styles.modalText, { color: palette.primary, fontSize: 14, marginTop: 8 }]}>
              ¡Ganarás 10 puntos! 🎉
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: palette.primary }]} onPress={confirmComplete}>
                <Text style={[styles.modalButtonText, { color: palette.onPrimary }]}>¡Completar!</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: isDark ? '#333' : '#eee' }]} onPress={cancelComplete}>
                <Text style={[styles.modalButtonText, { color: palette.primary }]}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de ayuda */}
      <Modal
        visible={helpModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setHelpModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: palette.cardWarm }]}>
            <Text style={[styles.modalTitle, { color: palette.text }]}>Consejos de uso</Text>
            <View style={styles.helpContent}>
              <View style={styles.helpItem}>
                <Ionicons name="hand-left-outline" size={24} color={palette.primary} style={styles.helpIcon} />
                <Text style={[styles.helpText, { color: palette.text }]}>
                  Toca una tarea para expandir o contraer el texto
                </Text>
              </View>
              <View style={styles.helpItem}>
                <Ionicons name="time-outline" size={24} color={palette.primary} style={styles.helpIcon} />
                <Text style={[styles.helpText, { color: palette.text }]}>
                  Mantén presionada para editar o eliminar la tarea
                </Text>
              </View>
            </View>
            <TouchableOpacity 
              style={{
                backgroundColor: palette.primary,
                borderRadius: 16,
                paddingVertical: 16,
                paddingHorizontal: 32,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 16,
                minWidth: 120,
              }}
              onPress={() => setHelpModalVisible(false)}
            >
              <Text style={{
                color: palette.onPrimary,
                fontFamily: 'Nunito-Bold',
                fontSize: 18,
                fontWeight: 'bold',
                textAlign: 'center',
              }}>
                Entendido
              </Text>
            </TouchableOpacity>
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
    marginTop: '3%',
    marginBottom: '2%',
    color: Colors.text,
  },
  taskItem: {
    backgroundColor: Colors.card,
    borderRadius: 32, // Más redondeado para efecto de tarjeta de misión
    padding: '2.5%',
    marginBottom: '1.5%', // Cambiado a porcentaje para mejor adaptabilidad
    marginTop: '1.2%',
    marginHorizontal: 0,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 }, // Sombra más pronunciada
    shadowOpacity: 0.25, // Mayor opacidad para efecto de elevación
    shadowRadius: 24, // Radio de sombra más amplio
    elevation: 12, // Elevación más alta para Android
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

  empty: {
    color: Colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    marginVertical: '4%',
  },
  ajoloteContainer: {
    marginVertical: '4%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ajoloteImage: {
    width: '18%',
    height: '18%',
    marginBottom: '1%',
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
  menuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.08)',
    width: '100%',
  },
  helpContent: {
    width: '100%',
    marginBottom: 24,
  },
  helpItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  helpIcon: {
    marginRight: 12,
  },
  helpText: {
    fontSize: 16,
    lineHeight: 22,
    flex: 1,
  },
  sectionTitle: {
    fontFamily: 'Nunito-Bold',
    fontSize: 20,
    fontWeight: 'bold',
  },
  completedTaskItem: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  completedTaskText: {
    fontFamily: 'Nunito',
    fontSize: 16,
    textDecorationLine: 'line-through',
    marginBottom: 4,
  },
  completedDate: {
    fontFamily: 'Nunito',
    fontSize: 12,
    opacity: 0.7,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  dateSectionTitle: {
    fontFamily: 'Nunito-Bold',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  modalLabel: {
    fontFamily: 'Nunito-Bold',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
}); 