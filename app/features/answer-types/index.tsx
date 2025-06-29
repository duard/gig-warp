import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import { answerTypeService } from '../../features/answer-types/services/answerTypeService';
import { AnswerType } from '../../features/answer-types/types';

export default function AnswerTypesScreen() {
  const [answerTypes, setAnswerTypes] = useState<AnswerType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAnswerType, setEditingAnswerType] = useState<AnswerType | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    component_name: '',
    is_active: true,
  });

  useEffect(() => {
    fetchAnswerTypes();
  }, []);

  const fetchAnswerTypes = async () => {
    try {
      const data = await answerTypeService.getAllAnswerTypes();
      setAnswerTypes(data);
    } catch (error) {
      console.error('Error fetching answer types:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAnswerType = async () => {
    try {
      if (editingAnswerType) {
        await answerTypeService.updateAnswerType(editingAnswerType.id, formData);
      } else {
        await answerTypeService.createAnswerType({
          ...formData,
        });
      }
      setShowModal(false);
      setEditingAnswerType(null);
      setFormData({
        name: '',
        description: '',
        component_name: '',
        is_active: true,
      });
      fetchAnswerTypes();
    } catch (error) {
      Alert.alert('Error', 'Failed to save answer type.');
      console.error('Error saving answer type:', error);
    }
  };

  const handleDeleteAnswerType = (id: string) => {
    Alert.alert(
      'Delete Answer Type',
      'Are you sure you want to delete this answer type?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await answerTypeService.deleteAnswerType(id);
              fetchAnswerTypes();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete answer type.');
              console.error('Error deleting answer type:', error);
            }
          },
        },
      ]
    );
  };

  const openCreateModal = () => {
    setEditingAnswerType(null);
    setFormData({
      name: '',
      description: '',
      component_name: '',
      is_active: true,
    });
    setShowModal(true);
  };

  const openEditModal = (item: AnswerType) => {
    setEditingAnswerType(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      component_name: item.component_name,
      is_active: item.is_active,
    });
    setShowModal(true);
  };

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Loading Answer Types...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={openCreateModal}>
        <FontAwesome name="plus" size={20} color="white" />
        <Text style={styles.addButtonText}>Add New Answer Type</Text>
      </TouchableOpacity>
      <FlatList
        data={answerTypes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <View>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDescription}>{item.description}</Text>
            </View>
            <View style={styles.itemActions}>
              <TouchableOpacity onPress={() => openEditModal(item)} style={styles.actionButton}>
                <FontAwesome name="edit" size={20} color="#007AFF" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteAnswerType(item.id)} style={styles.actionButton}>
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
            <Text style={styles.modalTitle}>{editingAnswerType ? 'Edit Answer Type' : 'Create Answer Type'}</Text>
            <TouchableOpacity onPress={handleSaveAnswerType}>
              <Text style={styles.saveButton}>Save</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            <Text style={styles.label}>Name:</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholder="Answer Type Name"
            />
            <Text style={styles.label}>Description:</Text>
            <TextInput
              style={styles.input}
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              placeholder="Description"
            />
            <Text style={styles.label}>Component Name:</Text>
            <TextInput
              style={styles.input}
              value={formData.component_name}
              onChangeText={(text) => setFormData({ ...formData, component_name: text })}
              placeholder="e.g., TextInputComponent"
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