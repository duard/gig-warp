import { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { observer } from '@legendapp/state/react';
import { Tables } from '../../../types/database';
import {
  addTodo,
  toggleDone,
  softDeleteTodo,
  hardDeleteTodo,
  todos$ as _todos$,
} from '../../../features/todos/services/todoService';

const NOT_DONE_ICON = String.fromCodePoint(0x1f7e0);
const DONE_ICON = String.fromCodePoint(0x2705);
const DELETE_ICON = String.fromCodePoint(0x1f5d1);

const NewTodo = () => {
  const [text, setText] = useState('');
  const handleSubmitEditing = ({ nativeEvent: { text } }: { nativeEvent: { text: string } }) => {
    if (text.trim()) {
      setText('');
      addTodo(text);
    }
  };
  return (
    <TextInput
      value={text}
      onChangeText={(text) => setText(text)}
      onSubmitEditing={handleSubmitEditing}
      placeholder="What needs to be done?"
      style={styles.input}
    />
  );
};

const Todo = ({ todo }: { todo: Tables<'todos'> }) => {
  const handleToggle = () => {
    toggleDone(todo.id);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Todo',
      'How do you want to delete this item?',
      [
        {
          text: 'Soft Delete',
          onPress: () => softDeleteTodo(todo.id),
          style: 'default',
        },
        {
          text: 'Hard Delete',
          onPress: () => hardDeleteTodo(todo.id),
          style: 'destructive',
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.todoContainer}>
      <TouchableOpacity
        onPress={handleToggle}
        style={[styles.todo, todo.done ? styles.done : null]}
      >
        <Text style={styles.todoText}>
          {todo.done ? DONE_ICON : NOT_DONE_ICON} {todo.text}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>{DELETE_ICON}</Text>
      </TouchableOpacity>
    </View>
  );
};

const Todos = observer(({ todos$ }: { todos$: typeof _todos$ }) => {
  const todos = todos$.get();

  const activeTodos: Tables<'todos'>[] = todos
    ? Object.values(todos).filter((todo): todo is Tables<'todos'> => !!todo && !todo.deleted)
    : [];

  const renderItem = ({ item: todo }: { item: Tables<'todos'> }) => (
    <Todo todo={todo} />
  );

  return (
    <FlatList
      data={activeTodos}
      renderItem={renderItem}
      style={styles.todos}
      keyExtractor={(item) => item.id}
    />
  );
});

const ClearTodos = observer(() => {
  const todos = _todos$.get();
  const activeTodos: Tables<'todos'>[] = todos
    ? Object.values(todos).filter((todo): todo is Tables<'todos'> => !!todo && !todo.deleted)
    : [];

  const handleClearAll = () => {
    if (activeTodos.length > 0) {
      Alert.alert(
        'Clear All Todos',
        'This will soft delete all todos. Continue?',
        [
          {
            text: 'Yes',
            onPress: () => {
              activeTodos.forEach((todo) => softDeleteTodo(todo.id));
            },
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ],
        { cancelable: true }
      );
    }
  };

  return activeTodos.length > 0 ? (
    <TouchableOpacity onPress={handleClearAll} style={styles.clearButton}>
      <Text style={styles.clearButtonText}>Clear All</Text>
    </TouchableOpacity>
  ) : null;
});

const TodosScreen = observer(() => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.heading}>Todos</Text>
        <NewTodo />
        <ClearTodos />
        <Todos todos$={_todos$} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    margin: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  input: {
    borderColor: '#999',
    borderRadius: 8,
    borderWidth: 2,
    flex: 0,
    height: 64,
    marginBottom: 16,
    padding: 16,
    fontSize: 20,
  },
  todos: {
    flex: 1,
  },
  todoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  todo: {
    borderRadius: 8,
    padding: 16,
    backgroundColor: '#ffd',
    flex: 1,
  },
  done: {
    backgroundColor: '#dfd',
  },
  todoText: {
    fontSize: 20,
  },
  deleteButton: {
    marginLeft: 8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#ff4444',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 20,
  },
  clearButton: {
    backgroundColor: '#ff4444',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  clearButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TodosScreen;
