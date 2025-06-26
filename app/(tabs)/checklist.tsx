import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export default function ChecklistScreen() {
  const [items, setItems] = useState<ChecklistItem[]>([
    { id: '1', text: 'Set up Supabase', completed: true },
    { id: '2', text: 'Create navigation tabs', completed: true },
    { id: '3', text: 'Add checklist functionality', completed: false },
    { id: '4', text: 'Implement profile screen', completed: false },
  ]);
  const [newItemText, setNewItemText] = useState('');

  const addItem = () => {
    if (newItemText.trim()) {
      const newItem: ChecklistItem = {
        id: Date.now().toString(),
        text: newItemText.trim(),
        completed: false,
      };
      setItems([...items, newItem]);
      setNewItemText('');
    }
  };

  const toggleItem = (id: string) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const deleteItem = (id: string) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {
          setItems(items.filter(item => item.id !== id));
        }},
      ]
    );
  };

  const renderItem = ({ item }: { item: ChecklistItem }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        style={[styles.checkbox, item.completed && styles.checkboxCompleted]}
        onPress={() => toggleItem(item.id)}
      >
        {item.completed && <FontAwesome name="check" size={16} color="white" />}
      </TouchableOpacity>
      <Text style={[styles.itemText, item.completed && styles.itemTextCompleted]}>
        {item.text}
      </Text>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteItem(item.id)}
      >
        <FontAwesome name="trash" size={18} color="#ff4444" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Checklist</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add new task..."
          value={newItemText}
          onChangeText={setNewItemText}
          onSubmitEditing={addItem}
          returnKeyType="done"
        />
        <TouchableOpacity style={styles.addButton} onPress={addItem}>
          <FontAwesome name="plus" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.stats}>
        <Text style={styles.statsText}>
          {items.filter(item => item.completed).length} of {items.length} completed
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
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
});
