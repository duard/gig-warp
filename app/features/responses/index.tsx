import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import { responseService } from '../../features/responses/services/responseService';
import { Response } from '../../features/responses/types';

export default function ResponsesScreen() {
  const [responses, setResponses] = useState<Response[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingResponse, setEditingResponse] = useState<Response | null>(null);
  const [formData, setFormData] = useState({
    task_list_id: '',
    user_id: '',
    target_type: '',
    target_id: '',
    status_id: '',
    started_at: new Date().toISOString(), // Added started_at
    completed_at: '',
    is_active: true,
  });

  useEffect(() => {
    fetchResponses();
  }, []);

  const fetchResponses = async () => {
    try {
      const data = await responseService.getAllResponses();
      setResponses(data);
    } catch (error) {
      console.error('Error fetching responses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveResponse = async () => {
    try {
      const responseData = {
        ...formData,
        completed_at: formData.completed_at ? new Date(formData.completed_at).toISOString() : null,
      };

      if (editingResponse) {
        await responseService.updateResponse(editingResponse.id, responseData);
      } else {
        await responseService.createResponse(responseData);
      }
      setShowModal(false);
      setEditingResponse(null);
      setFormData({
        task_list_id: '',
        user_id: '',
        target_type: '',
        target_id: '',
        status_id: '',
        started_at: new Date().toISOString(),
        completed_at: '',
        is_active: true,
      });
      fetchResponses();
    } catch (error) {
      Alert.alert('Error', 'Failed to save response.');
      console.error('Error saving response:', error);
    }
  };

  const handleDeleteResponse = (id: string) => {
    Alert.alert(
      'Delete Response',
      'Are you sure you want to delete this response?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await responseService.deleteResponse(id);
              fetchResponses();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete response.');
              console.error('Error deleting response:', error);
            }
          },
        },
      ]
    );
  };

  const openCreateModal = () => {
    setEditingResponse(null);
    setFormData({
      task_list_id: '',
      user_id: '',
      target_type: '',
      target_id: '',
      status_id: '',
      started_at: new Date().toISOString(),
      completed_at: '',
      is_active: true,
    });
    setShowModal(true);
  };

  const openEditModal = (item: Response) => {
    setEditingResponse(item);
    setFormData({
      task_list_id: item.task_list_id,
      user_id: item.user_id,
      target_type: item.target_type,
      target_id: item.target_id,
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
        <Text>Loading Responses...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={openCreateModal}>
        <FontAwesome name="plus" size={20} color="white" />
        <Text style={styles.addButtonText}>Add New Response</Text>
      </TouchableOpacity>
      <FlatList
        data={responses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <View>
              <Text style={styles.itemName}>Response ID: {item.id}</Text>
              <Text style={styles.itemDescription}>Task List ID: {item.task_list_id}</Text>
              <Text style={styles.itemDescription}>User ID: {item.user_id}</Text>
            </View>
            <View style={styles.itemActions}>
              <TouchableOpacity onPress={() => openEditModal(item)} style={styles.actionButton}>
                <FontAwesome name="edit" size={20} color="#007AFF" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteResponse(item.id)} style={styles.actionButton}>
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
            <Text style={styles.modalTitle}>{editingResponse ? 'Edit Response' : 'Create Response'}</Text>
            <TouchableOpacity onPress={handleSaveResponse}>
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
            <Text style={styles.label}>User ID:</Text>
            <TextInput
              style={styles.input}
              value={formData.user_id}
              onChangeText={(text) => setFormData({ ...formData, user_id: text })}
              placeholder="User ID"
            />
            <Text style={styles.label}>Target Type:</Text>
            <TextInput
              style={styles.input}
              value={formData.target_type}
              onChangeText={(text) => setFormData({ ...formData, target_type: text })}
              placeholder="e.g., task, survey"
            />
            <Text style={styles.label}>Target ID:</Text>
            <TextInput
              style={styles.input}
              value={formData.target_id}
              onChangeText={(text) => setFormData({ ...formData, target_id: text })}
              placeholder="Target ID"
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