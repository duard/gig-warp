import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import { statusTypeService } from '../../features/status-types/services/statusTypeService';
import { StatusType } from '../../features/status-types/types';

export default function StatusTypesScreen() {
  const [statusTypes, setStatusTypes] = useState<StatusType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStatusType, setEditingStatusType] = useState<StatusType | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '',
    color: '',
    is_active: true,
  });

  useEffect(() => {
    fetchStatusTypes();
  }, []);

  const fetchStatusTypes = async () => {
    try {
      const data = await statusTypeService.getAllStatusTypes();
      setStatusTypes(data);
    } catch (error) {
      console.error('Error fetching status types:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveStatusType = async () => {
    try {
      if (editingStatusType) {
        await statusTypeService.updateStatusType(editingStatusType.id, formData);
      } else {
        await statusTypeService.createStatusType({
          ...formData,
        });
      }
      setShowModal(false);
      setEditingStatusType(null);
      setFormData({
        name: '',
        description: '',
        icon: '',
        color: '',
        is_active: true,
      });
      fetchStatusTypes();
    } catch (error) {
      Alert.alert('Error', 'Failed to save status type.');
      console.error('Error saving status type:', error);
    }
  };

  const handleDeleteStatusType = (id: string) => {
    Alert.alert(
      'Delete Status Type',
      'Are you sure you want to delete this status type?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await statusTypeService.deleteStatusType(id);
              fetchStatusTypes();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete status type.');
              console.error('Error deleting status type:', error);
            }
          },
        },
      ]
    );
  };

  const openCreateModal = () => {
    setEditingStatusType(null);
    setFormData({
      name: '',
      description: '',
      icon: '',
      color: '',
      is_active: true,
    });
    setShowModal(true);
  };

  const openEditModal = (item: StatusType) => {
    setEditingStatusType(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      icon: item.icon || '',
      color: item.color || '',
      is_active: item.is_active,
    });
    setShowModal(true);
  };

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Loading Status Types...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={openCreateModal}>
        <FontAwesome name="plus" size={20} color="white" />
        <Text style={styles.addButtonText}>Add New Status Type</Text>
      </TouchableOpacity>
      <FlatList
        data={statusTypes}
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
              <TouchableOpacity onPress={() => handleDeleteStatusType(item.id)} style={styles.actionButton}>
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
            <Text style={styles.modalTitle}>{editingStatusType ? 'Edit Status Type' : 'Create Status Type'}</Text>
            <TouchableOpacity onPress={handleSaveStatusType}>
              <Text style={styles.saveButton}>Save</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            <Text style={styles.label}>Name:</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholder="Status Name"
            />
            <Text style={styles.label}>Description:</Text>
            <TextInput
              style={styles.input}
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              placeholder="Description"
            />
            <Text style={styles.label}>Icon (FontAwesome name):</Text>
            <TextInput
              style={styles.input}
              value={formData.icon}
              onChangeText={(text) => setFormData({ ...formData, icon: text })}
              placeholder="e.g., check-circle"
            />
            <Text style={styles.label}>Color (Hex or Name):</Text>
            <TextInput
              style={styles.input}
              value={formData.color}
              onChangeText={(text) => setFormData({ ...formData, color: text })}
              placeholder="e.g., #007AFF or red"
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