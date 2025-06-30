import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { taskListService } from '../task-lists/services/taskListService';
import { statusTypeService } from '../status-types/services/statusTypeService';
import { responseService } from './services/responseService';
import { Response } from './types/types';

// Inlined SearchableSelect component
interface Option {
  label: string;
  value: string;
}

interface SearchableSelectProps {
  options: Option[];
  onSelect: (value: string) => void;
  selectedValue: string;
  placeholder?: string;
  label?: string;
}

function SearchableSelect({
  options,
  onSelect,
  selectedValue,
  placeholder,
  label,
}: SearchableSelectProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSelect = (value: string) => {
    onSelect(value);
    setModalVisible(false);
    setSearchText('');
  };

  const displayLabel = selectedValue
    ? options.find((opt) => opt.value === selectedValue)?.label || selectedValue
    : '';

  return (
    <View style={searchableSelectStyles.container}>
      {label && <Text style={searchableSelectStyles.label}>{label}</Text>}
      <TouchableOpacity style={searchableSelectStyles.inputContainer} onPress={() => setModalVisible(true)}>
        <TextInput
          style={searchableSelectStyles.input}
          placeholder={placeholder}
          value={displayLabel}
          editable={false} // Make it non-editable to force selection via modal
        />
        <FontAwesome name="chevron-down" size={16} color="#666" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={searchableSelectStyles.modalContent}>
          <View style={searchableSelectStyles.modalHeader}>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={searchableSelectStyles.closeButton}>
              <FontAwesome name="times" size={24} color="#007AFF" />
            </TouchableOpacity>
            <Text style={searchableSelectStyles.modalTitle}>{label || placeholder || 'Select an Option'}</Text>
          </View>
          <TextInput
            style={searchableSelectStyles.searchInput}
            placeholder="Search..."
            value={searchText}
            onChangeText={setSearchText}
          />
          <FlatList
            data={filteredOptions}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={searchableSelectStyles.optionItem}
                onPress={() => handleSelect(item.value)}
              >
                <Text style={searchableSelectStyles.optionText}>{item.label}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </View>
  );
}

const searchableSelectStyles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  modalContent: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  closeButton: {
    padding: 5,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    backgroundColor: 'white',
  },
  optionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: 'white',
  },
  optionText: {
    fontSize: 16,
  },
});

export default function ResponsesScreen() {
  const [responses, setResponses] = useState<Response[]>([]);
  const [taskLists, setTaskLists] = useState<any[]>([]);
  const [statusTypes, setStatusTypes] = useState<any[]>([]);
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
    const fetchData = async () => {
      await fetchResponses();
      await fetchTaskLists();
      await fetchStatusTypes();
      setLoading(false);
    };
    fetchData();
  }, []);

  const fetchTaskLists = async () => {
    try {
      const data = await taskListService.getAllTaskLists();
      setTaskLists(data);
    } catch (error) {
      console.error('Error fetching task lists:', error);
    }
  };

  const fetchStatusTypes = async () => {
    try {
      const data = await statusTypeService.getAllStatusTypes();
      setStatusTypes(data);
    } catch (error) {
      console.error('Error fetching status types:', error);
    }
  };

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
              <TouchableOpacity onPress={() => router.push(`/features/answers?response_id=${item.id}`)} style={styles.actionButton}>
                <FontAwesome name="check-square" size={20} color="#007AFF" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push(`/features/approvals?response_id=${item.id}`)} style={styles.actionButton}>
                <FontAwesome name="thumbs-up" size={20} color="#007AFF" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push(`/features/responses/answer-question?response_id=${item.id}&task_list_id=${item.task_list_id}`)} style={styles.actionButton}>
                <FontAwesome name="question-circle" size={20} color="#007AFF" />
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
            <SearchableSelect
              options={taskLists.map(tl => ({ label: tl.name, value: tl.id }))}
              onSelect={(value) => setFormData({ ...formData, task_list_id: value })}
              selectedValue={formData.task_list_id}
              placeholder="Select Task List"
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
            <SearchableSelect
              options={statusTypes.map(st => ({ label: st.name, value: st.id }))}
              onSelect={(value) => setFormData({ ...formData, status_id: value })}
              selectedValue={formData.status_id}
              placeholder="Select Status Type"
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