import { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Text, View, useThemeColor } from '@/components/Themed';
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
  const inputBorderColor = useThemeColor({}, 'tabIconDefault');
  const inputTextColor = useThemeColor({}, 'text');

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
      style={[styles.input, { borderColor: inputBorderColor, color: inputTextColor }]} // Apply themed colors
      placeholderTextColor={inputTextColor} // Apply themed color for placeholder
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

  const todoBackgroundColor = useThemeColor({}, 'background');
  const doneBackgroundColor = useThemeColor({ light: '#dfd', dark: '#224422' }, 'background');
  const deleteButtonBackgroundColor = useThemeColor({ light: '#ff4444', dark: '#880000' }, 'tint');
  const deleteButtonTextColor = useThemeColor({}, 'text');

  return (
    <View style={styles.todoContainer}>
      <TouchableOpacity
        onPress={handleToggle}
        style={[
          styles.todo,
          { backgroundColor: todo.done ? doneBackgroundColor : todoBackgroundColor },
        ]}
      >
        <Text style={styles.todoText}>
          {todo.done ? DONE_ICON : NOT_DONE_ICON} {todo.text}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleDelete} style={[styles.deleteButton, { backgroundColor: deleteButtonBackgroundColor }]}>
        <Text style={[styles.deleteButtonText, { color: deleteButtonTextColor }]}>{DELETE_ICON}</Text>
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

  const clearButtonBackgroundColor = useThemeColor({ light: '#ff4444', dark: '#880000' }, 'tint');
  const clearButtonTextColor = useThemeColor({}, 'text');

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
    <TouchableOpacity onPress={handleClearAll} style={[styles.clearButton, { backgroundColor: clearButtonBackgroundColor }]}>
      <Text style={[styles.clearButtonText, { color: clearButtonTextColor }]}>Clear All</Text>
    </TouchableOpacity>
  ) : null;
});

const TodosScreen = observer(() => {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  return (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <Text style={[styles.heading, { color: textColor }]}>Todos</Text>
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
    borderColor: useThemeColor({}, 'tabIconDefault'),
    borderRadius: 8,
    borderWidth: 2,
    flex: 0,
    height: 64,
    marginBottom: 16,
    padding: 16,
    fontSize: 20,
    color: useThemeColor({}, 'text'),
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
    backgroundColor: useThemeColor({}, 'background'),
    flex: 1,
  },
  done: {
    backgroundColor: useThemeColor({ light: '#dfd', dark: '#224422' }, 'background'),
  },
  todoText: {
    fontSize: 20,
    color: useThemeColor({}, 'text'),
  },
  deleteButton: {
    marginLeft: 8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: useThemeColor({ light: '#ff4444', dark: '#880000' }, 'tint'),
  },
  deleteButtonText: {
    color: useThemeColor({}, 'text'),
    fontSize: 20,
  },
  clearButton: {
    backgroundColor: useThemeColor({ light: '#ff4444', dark: '#880000' }, 'tint'),
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  clearButtonText: {
    color: useThemeColor({}, 'text'),
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TodosScreen;
