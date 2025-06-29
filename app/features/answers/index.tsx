import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import { answerService } from '../../features/answers/services/answerService';
import { Answer } from '../../features/answers/types';

export default function AnswersScreen() {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAnswer, setEditingAnswer] = useState<Answer | null>(null);
  const [formData, setFormData] = useState({
    response_id: '',
    question_id: '',
    value: '',
    status_id: '',
    started_at: new Date().toISOString(), // Added started_at
    completed_at: '',
    is_active: true,
  });

  useEffect(() => {
    fetchAnswers();
  }, []);

  const fetchAnswers = async () => {
    try {
      const data = await answerService.getAllAnswers();
      setAnswers(data);
    } catch (error) {
      console.error('Error fetching answers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAnswer = async () => {
    try {
      const parsedValue = formData.value ? JSON.parse(formData.value) : null;
      const answerData = {
        ...formData,
        value: parsedValue,
        completed_at: formData.completed_at ? new Date(formData.completed_at).toISOString() : null,
      };

      if (editingAnswer) {
        await answerService.updateAnswer(editingAnswer.id, answerData);
      } else {
        await answerService.createAnswer(answerData);
      }
      setShowModal(false);
      setEditingAnswer(null);
      setFormData({
        response_id: '',
        question_id: '',
        value: '',
        status_id: '',
        started_at: new Date().toISOString(),
        completed_at: '',
        is_active: true,
      });
      fetchAnswers();
    } catch (error) {
      Alert.alert('Error', 'Failed to save answer.');
      console.error('Error saving answer:', error);
    }
  };

  const handleDeleteAnswer = (id: string) => {
    Alert.alert(
      'Delete Answer',
      'Are you sure you want to delete this answer?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await answerService.deleteAnswer(id);
              fetchAnswers();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete answer.');
              console.error('Error deleting answer:', error);
            }
          },
        },
      ]
    );
  };

  const openCreateModal = () => {
    setEditingAnswer(null);
    setFormData({
      response_id: '',
      question_id: '',
      value: '',
      status_id: '',
      started_at: new Date().toISOString(),
      completed_at: '',
      is_active: true,
    });
    setShowModal(true);
  };

  const openEditModal = (item: Answer) => {
    setEditingAnswer(item);
    setFormData({
      response_id: item.response_id,
      question_id: item.question_id,
      value: item.value ? JSON.stringify(item.value) : '',
      status_id: item.status_id || '',
      started_at: item.started_at,
      completed_at: item.completed_at || '',
      is_active: item.is_active,
    });
    setShowModal(true);
  };

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Loading Answers...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={openCreateModal}>
        <FontAwesome name="plus" size={20} color="white" />
        <Text style={styles.addButtonText}>Add New Answer</Text>
      </TouchableOpacity>
      <FlatList
        data={answers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <View>
              <Text style={styles.itemName}>Answer ID: {item.id}</Text>
              <Text style={styles.itemDescription}>Question ID: {item.question_id}</Text>
              <Text style={styles.itemDescription}>Response ID: {item.response_id}</Text>
            </View>
            <View style={styles.itemActions}>
              <TouchableOpacity onPress={() => openEditModal(item)} style={styles.actionButton}>
                <FontAwesome name="edit" size={20} color="#007AFF" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteAnswer(item.id)} style={styles.actionButton}>
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
            <Text style={styles.modalTitle}>{editingAnswer ? 'Edit Answer' : 'Create Answer'}</Text>
            <TouchableOpacity onPress={handleSaveAnswer}>
              <Text style={styles.saveButton}>Save</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            <Text style={styles.label}>Response ID:</Text>
            <TextInput
              style={styles.input}
              value={formData.response_id}
              onChangeText={(text) => setFormData({ ...formData, response_id: text })}
              placeholder="Response ID"
            />
            <Text style={styles.label}>Question ID:</Text>
            <TextInput
              style={styles.input}
              value={formData.question_id}
              onChangeText={(text) => setFormData({ ...formData, question_id: text })}
              placeholder="Question ID"
            />
            <Text style={styles.label}>Value (JSON):</Text>
            <TextInput
              style={styles.input}
              value={formData.value}
              onChangeText={(text) => setFormData({ ...formData, value: text })}
              placeholder={"e.g., \"text\":\"some value\""}
              multiline
            />
            <Text style={styles.label}>Status ID:</Text>
            <TextInput
              style={styles.input}
              value={formData.status_id}
              onChangeText={(text) => setFormData({ ...formData, status_id: text })}
              placeholder="Status ID"
            />
            <Text style={styles.label}>Completed At (ISO string):</Text>
            <TextInput
              style={styles.input}
              value={formData.completed_at}
              onChangeText={(text) => setFormData({ ...formData, completed_at: text })}
              placeholder="e.g., 2023-10-27T10:00:00Z"
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