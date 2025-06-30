import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { approvalService } from '../../features/approvals/services/approvalService';
import { Approval } from '../../features/approvals/types';

export default function ApprovalsScreen() {
  const { response_id } = useLocalSearchParams();
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingApproval, setEditingApproval] = useState<Approval | null>(null);
  const [formData, setFormData] = useState({
    response_id: '',
    approver_id: '',
    status_id: '',
    notes: '',
    is_active: true,
  });

  useEffect(() => {
    fetchApprovals();
  }, []);

  const fetchApprovals = async () => {
    try {
      let data;
      if (response_id) {
        const allApprovals = await approvalService.getAllApprovals();
        data = allApprovals.filter(approval => approval.response_id === response_id);
      } else {
        data = await approvalService.getAllApprovals();
      }
      setApprovals(data);
    } catch (error) {
      console.error('Error fetching approvals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveApproval = async () => {
    try {
      if (editingApproval) {
        await approvalService.updateApproval(editingApproval.id, formData);
      } else {
        await approvalService.createApproval({
          ...formData,
        });
      }
      setShowModal(false);
      setEditingApproval(null);
      setFormData({
        response_id: '',
        approver_id: '',
        status_id: '',
        notes: '',
        is_active: true,
      });
      fetchApprovals();
    } catch (error) {
      Alert.alert('Error', 'Failed to save approval.');
      console.error('Error saving approval:', error);
    }
  };

  const handleDeleteApproval = (id: string) => {
    Alert.alert(
      'Delete Approval',
      'Are you sure you want to delete this approval?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await approvalService.deleteApproval(id);
              fetchApprovals();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete approval.');
              console.error('Error deleting approval:', error);
            }
          },
        },
      ]
    );
  };

  const openCreateModal = () => {
    setEditingApproval(null);
    setFormData({
      response_id: '',
      approver_id: '',
      status_id: '',
      notes: '',
      is_active: true,
    });
    setShowModal(true);
  };

  const openEditModal = (item: Approval) => {
    setEditingApproval(item);
    setFormData({
      response_id: item.response_id,
      approver_id: item.approver_id,
      status_id: item.status_id,
      notes: item.notes || '',
      is_active: item.is_active,
    });
    setShowModal(true);
  };

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Loading Approvals...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={openCreateModal}>
        <FontAwesome name="plus" size={20} color="white" />
        <Text style={styles.addButtonText}>Add New Approval</Text>
      </TouchableOpacity>
      <FlatList
        data={approvals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <View>
              <Text style={styles.itemName}>Approval ID: {item.id}</Text>
              <Text style={styles.itemDescription}>Response ID: {item.response_id}</Text>
              <Text style={styles.itemDescription}>Approver ID: {item.approver_id}</Text>
              <Text style={styles.itemDescription}>Status ID: {item.status_id}</Text>
            </View>
            <View style={styles.itemActions}>
              <TouchableOpacity onPress={() => openEditModal(item)} style={styles.actionButton}>
                <FontAwesome name="edit" size={20} color="#007AFF" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteApproval(item.id)} style={styles.actionButton}>
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
            <Text style={styles.modalTitle}>{editingApproval ? 'Edit Approval' : 'Create Approval'}</Text>
            <TouchableOpacity onPress={handleSaveApproval}>
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
            <Text style={styles.label}>Approver ID:</Text>
            <TextInput
              style={styles.input}
              value={formData.approver_id}
              onChangeText={(text) => setFormData({ ...formData, approver_id: text })}
              placeholder="Approver ID"
            />
            <Text style={styles.label}>Status ID:</Text>
            <TextInput
              style={styles.input}
              value={formData.status_id}
              onChangeText={(text) => setFormData({ ...formData, status_id: text })}
              placeholder="Status ID"
            />
            <Text style={styles.label}>Notes:</Text>
            <TextInput
              style={styles.input}
              value={formData.notes}
              onChangeText={(text) => setFormData({ ...formData, notes: text })}
              placeholder="Notes"
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