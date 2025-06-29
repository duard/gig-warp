import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import { externalUserService } from '../../features/external-users/services/externalUserService';
import { ExternalUser } from '../../features/external-users/types';

export default function ExternalUsersScreen() {
  const [externalUsers, setExternalUsers] = useState<ExternalUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingExternalUser, setEditingExternalUser] = useState<ExternalUser | null>(null);
  const [formData, setFormData] = useState({
    supabase_user_id: '',
    external_system: '',
    external_user_id: '',
    is_active: true,
  });

  useEffect(() => {
    fetchExternalUsers();
  }, []);

  const fetchExternalUsers = async () => {
    try {
      const data = await externalUserService.getAllExternalUsers();
      setExternalUsers(data);
    } catch (error) {
      console.error('Error fetching external users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveExternalUser = async () => {
    try {
      if (editingExternalUser) {
        await externalUserService.updateExternalUser(editingExternalUser.id, formData);
      } else {
        await externalUserService.createExternalUser(formData);
      }
      setShowModal(false);
      setEditingExternalUser(null);
      setFormData({
        supabase_user_id: '',
        external_system: '',
        external_user_id: '',
        is_active: true,
      });
      fetchExternalUsers();
    } catch (error) {
      Alert.alert('Error', 'Failed to save external user.');
      console.error('Error saving external user:', error);
    }
  };

  const handleDeleteExternalUser = (id: string) => {
    Alert.alert(
      'Delete External User',
      'Are you sure you want to delete this external user?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await externalUserService.deleteExternalUser(id);
              fetchExternalUsers();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete external user.');
              console.error('Error deleting external user:', error);
            }
          },
        },
      ]
    );
  };

  const openCreateModal = () => {
    setEditingExternalUser(null);
    setFormData({
      supabase_user_id: '',
      external_system: '',
      external_user_id: '',
      is_active: true,
    });
    setShowModal(true);
  };

  const openEditModal = (item: ExternalUser) => {
    setEditingExternalUser(item);
    setFormData({
      supabase_user_id: item.supabase_user_id,
      external_system: item.external_system,
      external_user_id: item.external_user_id,
      is_active: item.is_active,
    });
    setShowModal(true);
  };

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Loading External Users...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={openCreateModal}>
        <FontAwesome name="plus" size={20} color="white" />
        <Text style={styles.addButtonText}>Add New External User</Text>
      </TouchableOpacity>
      <FlatList
        data={externalUsers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <View>
              <Text style={styles.itemName}>External System: {item.external_system}</Text>
              <Text style={styles.itemDescription}>External User ID: {item.external_user_id}</Text>
            </View>
            <View style={styles.itemActions}>
              <TouchableOpacity onPress={() => openEditModal(item)} style={styles.actionButton}>
                <FontAwesome name="edit" size={20} color="#007AFF" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteExternalUser(item.id)} style={styles.actionButton}>
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
            <Text style={styles.modalTitle}>{editingExternalUser ? 'Edit External User' : 'Create External User'}</Text>
            <TouchableOpacity onPress={handleSaveExternalUser}>
              <Text style={styles.saveButton}>Save</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            <Text style={styles.label}>Supabase User ID:</Text>
            <TextInput
              style={styles.input}
              value={formData.supabase_user_id}
              onChangeText={(text) => setFormData({ ...formData, supabase_user_id: text })}
              placeholder="Supabase User ID"
            />
            <Text style={styles.label}>External System:</Text>
            <TextInput
              style={styles.input}
              value={formData.external_system}
              onChangeText={(text) => setFormData({ ...formData, external_system: text })}
              placeholder="e.g., Salesforce, Jira"
            />
            <Text style={styles.label}>External User ID:</Text>
            <TextInput
              style={styles.input}
              value={formData.external_user_id}
              onChangeText={(text) => setFormData({ ...formData, external_user_id: text })}
              placeholder="External User ID"
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