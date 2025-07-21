import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, Modal, TextInput, useColorScheme } from 'react-native';
import { useState } from 'react';
import { Colors } from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

const MOTIVATIONS = [
  '¡Hoy es un gran día para avanzar! 🌞',
  'Recuerda: cada pequeño paso cuenta. 🐢',
  '¡Tú puedes con todo! 💪',
  'Hazlo por tu ajolote 🦎',
  'La constancia es la clave del éxito. 💪'
];

const initialTasks = [
  { id: '1', title: 'Tarea de ejemplo 1' },
  { id: '2', title: 'Tarea de ejemplo 2' },
];

type Task = { id: string; title: string };

export default function TasksScreen() {
  const [tasks, setTasks] = useState(initialTasks);
  const [modalVisible, setModalVisible] = useState(false);
  const [taskInput, setTaskInput] = useState('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const motivation = MOTIVATIONS[Math.floor(Math.random() * MOTIVATIONS.length)];

  const systemColorScheme = useColorScheme();
  const isDark = systemColorScheme === 'dark';
  const palette = isDark ? Colors.dark : Colors;

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
      setTasks(tasks.map(t => t.id === editingTask.id ? { ...t, title: taskInput } : t));
    } else {
      setTasks([...tasks, { id: Date.now().toString(), title: taskInput }]);
    }
    setModalVisible(false);
    setTaskInput('');
    setEditingTask(null);
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <View style={[styles.container, { backgroundColor: palette.background }] }>
      <Text style={[styles.title, { color: palette.text } ]}>Tareas de hoy</Text>
      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[styles.taskItem, { backgroundColor: palette.card }] }>
            <Text style={[styles.taskText, { color: palette.text } ]}>{item.title}</Text>
            <View style={styles.taskActions}>
              <TouchableOpacity onPress={() => openEditModal(item)}>
                <Ionicons name="create-outline" size={22} color={palette.primary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteTask(item.id)}>
                <Ionicons name="trash-outline" size={22} color="#d32f2f" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={[styles.empty, { color: palette.textSecondary } ]}>No tienes tareas para hoy.</Text>}
        style={{ width: '100%' }}
      />
      <View style={styles.ajoloteContainer}>
        <Image source={require('../../assets/images/axofi-logo-v1.png')} style={styles.ajoloteImage} resizeMode="contain" />
      </View>
      <Text style={[styles.motivation, { color: palette.primary } ]}>{motivation}</Text>
      <TouchableOpacity style={[styles.addButton, { backgroundColor: palette.primary }]} onPress={openAddModal}>
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
}); 