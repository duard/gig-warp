import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Text, View } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useObservable, observer } from '@legendapp/state/react';

import {
  todos$,
  addTodo,
  toggleDone,
  hardDeleteTodo,
  testSupabaseRealtime,
} from '@/features/todos/services/todoService';
import { debugSupabaseConnection } from '@/utils/debugSupabase';
import { Todo } from '@/features/todos/types';

function TodosScreenComponent() {
  const todos = useObservable(todos$);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      console.log('Todos screen focused');
      debugSupabaseConnection();
      testSupabaseRealtime();

      const timeout = setTimeout(() => {
        setLoading(false);
        console.log('todos.get()', todos.get());
      }, 500);

      return () => clearTimeout(timeout);
    }, [todos])
  );

  useEffect(() => {
    if (loading && Object.keys(todos.get() || {}).length > 0) {
      setLoading(false);
    }
  }, [todos, loading]);

  const handleAddTodo = () => {
    if (newTodoTitle.trim()) {
      addTodo(newTodoTitle.trim());
      setNewTodoTitle('');
    }
  };

  const handleToggleComplete = (todo: Todo) => {
    toggleDone(todo.id);
  };

  const handleDeleteTodo = (todo: Todo) => {
    Alert.alert(
      'Delete Todo',
      `Are you sure you want to delete "${todo.text}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => hardDeleteTodo(todo.id),
        },
      ]
    );
  };

  const renderTodoItem = ({ item }: { item: Todo }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        style={[styles.checkbox, item.done && styles.checkboxCompleted]}
        onPress={() => handleToggleComplete(item)}
      >
        {item.done && <FontAwesome name="check" size={16} color="white" />}
      </TouchableOpacity>
      <Text style={[styles.itemText, item.done && styles.itemTextCompleted]}>
        {item.text}
      </Text>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteTodo(item)}
      >
        <FontAwesome name="trash" size={18} color="#ff4444" />
      </TouchableOpacity>
    </View>
  );

  const todosArray = Object.values(todos.get() || {}).filter(Boolean) as Todo[];

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 12 }}>Loading todos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Todos</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add new todo..."
          value={newTodoTitle}
          onChangeText={setNewTodoTitle}
          onSubmitEditing={handleAddTodo}
          returnKeyType="done"
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddTodo}>
          <FontAwesome name="plus" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={todosArray}
        renderItem={renderTodoItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.stats}>
        <Text style={styles.statsText}>
          {todosArray.filter((todo) => todo.done).length} of {todosArray.length} completed
        </Text>
      </View>

      {todosArray.length === 0 && (
        <View style={styles.emptyState}>
          <FontAwesome name="check-circle-o" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No todos yet</Text>
          <Text style={styles.emptySubtext}>Add your first todo above</Text>
        </View>
      )}
    </View>
  );
}

export default observer(TodosScreenComponent);

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  center: { justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 28, fontWeight: 'bold' },
  inputContainer: { flexDirection: 'row', marginBottom: 20 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  addButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 12,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 48,
  },
  list: { flex: 1 },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#ddd',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxCompleted: { backgroundColor: '#4CAF50', borderColor: '#4CAF50' },
  itemText: { flex: 1, fontSize: 16 },
  itemTextCompleted: { textDecorationLine: 'line-through', color: '#999' },
  deleteButton: { padding: 5 },
  stats: { padding: 15, alignItems: 'center' },
  statsText: { fontSize: 16, color: '#666' },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#9e9e9e', marginTop: 16 },
  emptySubtext: { fontSize: 14, color: '#bdbdbd', textAlign: 'center', marginTop: 8 },
});
