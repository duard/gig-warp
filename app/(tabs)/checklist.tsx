import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useObservable } from '@legendapp/state/react';


import { todos$, addTodo, toggleDone, hardDeleteTodo, testSupabaseRealtime } from '../../features/checklists/services/todoService';
import { debugSupabaseConnection } from '../../utils/debugSupabase';

export default function ChecklistScreen() {
  const todos = useObservable(todos$);
  const [newTodoTitle, setNewTodoTitle] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      console.log('Checklist screen focused');
      console.log('Current todos count:', todos.length);
      debugSupabaseConnection();
      testSupabaseRealtime(); // Start listening for realtime changes
    }, [todos.length])
  );

  const handleDebug = async () => {
    console.log('🔧 Manual debug triggered');
    const result = await debugSupabaseConnection();
    Alert.alert(
      'Debug Results',
      `Connection: ${result.success ? 'Success' : 'Failed'}\nUser todos: ${result.userTodos?.length || 0}`,
      [{ text: 'OK' }]
    );
  };

  const handleAddTodo = () => {
    if (newTodoTitle.trim()) {
      addTodo(newTodoTitle.trim());
      setNewTodoTitle('');
    }
  };

  const handleToggleComplete = (todo: typeof todos[0]) => {
    toggleDone(todo.id);
  };

  const handleDeleteTodo = (todo: typeof todos[0]) => {
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

  const renderTodoItem = ({ item }: { item: typeof todos[0] }) => (
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

  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Todos</Text>
        <TouchableOpacity style={styles.debugButton} onPress={handleDebug}>
          <FontAwesome name="bug" size={16} color="#007AFF" />
        </TouchableOpacity>
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
        data={Object.values(todos)}
        renderItem={renderTodoItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.stats}>
        <Text style={styles.statsText}>
          {Object.values(todos).filter(todo => todo.done).length} of {Object.values(todos).length} completed
        </Text>
      </View>

      {Object.values(todos).length === 0 && (
        <View style={styles.emptyState}>
          <FontAwesome name="check-circle-o" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No todos yet</Text>
          <Text style={styles.emptySubtext}>Add your first todo above</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  debugButton: {
    padding: 8,
    borderRadius: 4,
    backgroundColor: '#f0f0f0',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
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
  list: {
    flex: 1,
  },
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
  checkboxCompleted: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  itemText: {
    flex: 1,
    fontSize: 16,
  },
  itemTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  deleteButton: {
    padding: 5,
  },
  stats: {
    padding: 15,
    alignItems: 'center',
  },
  statsText: {
    fontSize: 16,
    color: '#666',
  },
  loginMessage: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#9e9e9e',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#bdbdbd',
    textAlign: 'center',
    marginTop: 8,
  },
});
