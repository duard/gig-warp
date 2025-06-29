import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import { questionService } from '../../features/questions/services/questionService';
import { Question } from '../../features/questions/types';

export default function QuestionsScreen() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [formData, setFormData] = useState({
    task_list_id: '',
    question_text: '',
    description: '',
    answer_type_id: '',
    is_required: false,
    order_index: 0,
    options: '',
    default_status_id: '',
    is_active: true,
  });

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const data = await questionService.getAllQuestions();
      setQuestions(data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveQuestion = async () => {
    try {
      const parsedOptions = formData.options ? JSON.parse(formData.options) : null;
      const questionData = {
        ...formData,
        order_index: Number(formData.order_index),
        options: parsedOptions,
      };

      if (editingQuestion) {
        await questionService.updateQuestion(editingQuestion.id, questionData);
      } else {
        await questionService.createQuestion(questionData);
      }
      setShowModal(false);
      setEditingQuestion(null);
      setFormData({
        task_list_id: '',
        question_text: '',
        description: '',
        answer_type_id: '',
        is_required: false,
        order_index: 0,
        options: '',
        default_status_id: '',
        is_active: true,
      });
      fetchQuestions();
    } catch (error) {
      Alert.alert('Error', 'Failed to save question.');
      console.error('Error saving question:', error);
    }
  };

  const handleDeleteQuestion = (id: string) => {
    Alert.alert(
      'Delete Question',
      'Are you sure you want to delete this question?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await questionService.deleteQuestion(id);
              fetchQuestions();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete question.');
              console.error('Error deleting question:', error);
            }
          },
        },
      ]
    );
  };

  const openCreateModal = () => {
    setEditingQuestion(null);
    setFormData({
      task_list_id: '',
      question_text: '',
      description: '',
      answer_type_id: '',
      is_required: false,
      order_index: 0,
      options: '',
      default_status_id: '',
      is_active: true,
    });
    setShowModal(true);
  };

  const openEditModal = (item: Question) => {
    setEditingQuestion(item);
    setFormData({
      task_list_id: item.task_list_id,
      question_text: item.question_text,
      description: item.description || '',
      answer_type_id: item.answer_type_id,
      is_required: item.is_required,
      order_index: item.order_index,
      options: item.options ? JSON.stringify(item.options) : '',
      default_status_id: item.default_status_id || '',
      is_active: item.is_active,
    });
    setShowModal(true);
  };

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Loading Questions...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={openCreateModal}>
        <FontAwesome name="plus" size={20} color="white" />
        <Text style={styles.addButtonText}>Add New Question</Text>
      </TouchableOpacity>
      <FlatList
        data={questions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <View>
              <Text style={styles.itemName}>{item.question_text}</Text>
              <Text style={styles.itemDescription}>{item.description}</Text>
            </View>
            <View style={styles.itemActions}>
              <TouchableOpacity onPress={() => openEditModal(item)} style={styles.actionButton}>
                <FontAwesome name="edit" size={20} color="#007AFF" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteQuestion(item.id)} style={styles.actionButton}>
                <FontAwesome name="trash" size={20} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <Modal
        visible={showModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{editingQuestion ? 'Edit Question' : 'Create Question'}</Text>
            <TouchableOpacity onPress={handleSaveQuestion}>
              <Text style={styles.saveButton}>Save</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            <Text style={styles.label}>Task List ID:</Text>
            <TextInput
              style={styles.input}
              value={formData.task_list_id}
              onChangeText={(text) => setFormData({ ...formData, task_list_id: text })}
              placeholder="Task List ID"
            />
            <Text style={styles.label}>Question Text:</Text>
            <TextInput
              style={styles.input}
              value={formData.question_text}
              onChangeText={(text) => setFormData({ ...formData, question_text: text })}
              placeholder="Question Text"
            />
            <Text style={styles.label}>Description:</Text>
            <TextInput
              style={styles.input}
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              placeholder="Description"
            />
            <Text style={styles.label}>Answer Type ID:</Text>
            <TextInput
              style={styles.input}
              value={formData.answer_type_id}
              onChangeText={(text) => setFormData({ ...formData, answer_type_id: text })}
              placeholder="Answer Type ID"
            />
            <Text style={styles.label}>Order Index:</Text>
            <TextInput
              style={styles.input}
              value={String(formData.order_index)}
              onChangeText={(text) => setFormData({ ...formData, order_index: Number(text) })}
              keyboardType="numeric"
              placeholder="Order Index"
            />
            <Text style={styles.label}>Options (JSON):</Text>
            <TextInput
              style={styles.input}
              value={formData.options}
              onChangeText={(text) => setFormData({ ...formData, options: text })}
              placeholder={"e.g., {\"key\":\"value\"}"}
              multiline
            />
            <Text style={styles.label}>Default Status ID:</Text>
            <TextInput
              style={styles.input}
              value={formData.default_status_id}
              onChangeText={(text) => setFormData({ ...formData, default_status_id: text })}
              placeholder="Default Status ID"
            />
            {/* is_active toggle could be added here */}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  itemContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
  },
  itemActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    padding: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: 'white',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    fontSize: 16,
    color: '#007AFF',
  },
  saveButton: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    backgroundColor: 'white',
  },
});