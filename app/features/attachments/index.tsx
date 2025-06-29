import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import { attachmentService } from '../../features/attachments/services/attachmentService';
import { Attachment } from '../../features/attachments/types';

export default function AttachmentsScreen() {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAttachment, setEditingAttachment] = useState<Attachment | null>(null);
  const [formData, setFormData] = useState({
    file_id: '',
    target_type: '',
    target_id: '',
    description: '',
    is_active: true,
  });

  useEffect(() => {
    fetchAttachments();
  }, []);

  const fetchAttachments = async () => {
    try {
      const data = await attachmentService.getAllAttachments();
      setAttachments(data);
    } catch (error) {
      console.error('Error fetching attachments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAttachment = async () => {
    try {
      if (editingAttachment) {
        await attachmentService.updateAttachment(editingAttachment.id, formData);
      } else {
        await attachmentService.createAttachment(formData);
      }
      setShowModal(false);
      setEditingAttachment(null);
      setFormData({
        file_id: '',
        target_type: '',
        target_id: '',
        description: '',
        is_active: true,
      });
      fetchAttachments();
    } catch (error) {
      Alert.alert('Error', 'Failed to save attachment.');
      console.error('Error saving attachment:', error);
    }
  };

  const handleDeleteAttachment = (id: string) => {
    Alert.alert(
      'Delete Attachment',
      'Are you sure you want to delete this attachment?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await attachmentService.deleteAttachment(id);
              fetchAttachments();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete attachment.');
              console.error('Error deleting attachment:', error);
            }
          },
        },
      ]
    );
  };

  const openCreateModal = () => {
    setEditingAttachment(null);
    setFormData({
      file_id: '',
      target_type: '',
      target_id: '',
      description: '',
      is_active: true,
    });
    setShowModal(true);
  };

  const openEditModal = (item: Attachment) => {
    setEditingAttachment(item);
    setFormData({
      file_id: item.file_id,
      target_type: item.target_type,
      target_id: item.target_id,
      description: item.description || '',
      is_active: item.is_active,
    });
    setShowModal(true);
  };

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Loading Attachments...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={openCreateModal}>
        <FontAwesome name="plus" size={20} color="white" />
        <Text style={styles.addButtonText}>Add New Attachment</Text>
      </TouchableOpacity>
      <FlatList
        data={attachments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <View>
              <Text style={styles.itemName}>File ID: {item.file_id}</Text>
              <Text style={styles.itemDescription}>Target Type: {item.target_type}</Text>
              <Text style={styles.itemDescription}>Target ID: {item.target_id}</Text>
            </View>
            <View style={styles.itemActions}>
              <TouchableOpacity onPress={() => openEditModal(item)} style={styles.actionButton}>
                <FontAwesome name="edit" size={20} color="#007AFF" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteAttachment(item.id)} style={styles.actionButton}>
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
            <Text style={styles.modalTitle}>{editingAttachment ? 'Edit Attachment' : 'Create Attachment'}</Text>
            <TouchableOpacity onPress={handleSaveAttachment}>
              <Text style={styles.saveButton}>Save</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            <Text style={styles.label}>File ID:</Text>
            <TextInput
              style={styles.input}
              value={formData.file_id}
              onChangeText={(text) => setFormData({ ...formData, file_id: text })}
              placeholder="File ID"
            />
            <Text style={styles.label}>Target Type:</Text>
            <TextInput
              style={styles.input}
              value={formData.target_type}
              onChangeText={(text) => setFormData({ ...formData, target_type: text })}
              placeholder="e.g., response, profile"
            />
            <Text style={styles.label}>Target ID:</Text>
            <TextInput
              style={styles.input}
              value={formData.target_id}
              onChangeText={(text) => setFormData({ ...formData, target_id: text })}
              placeholder="Target ID"
            />
            <Text style={styles.label}>Description:</Text>
            <TextInput
              style={styles.input}
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              placeholder="Description"
              multiline
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