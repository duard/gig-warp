import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import { fileService } from '../../features/files/services/fileService';
import { File } from '../../features/files/types';

export default function FilesScreen() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFile, setEditingFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    storage_path: '',
    mime_type: '',
    file_name: '',
    byte_size: '',
    is_active: true,
  });

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const data = await fileService.getAllFiles();
      setFiles(data);
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFile = async () => {
    try {
      const fileData = {
        ...formData,
        byte_size: Number(formData.byte_size),
      };

      if (editingFile) {
        await fileService.updateFile(editingFile.id, fileData);
      } else {
        await fileService.createFile(fileData);
      }
      setShowModal(false);
      setEditingFile(null);
      setFormData({
        storage_path: '',
        mime_type: '',
        file_name: '',
        byte_size: '',
        is_active: true,
      });
      fetchFiles();
    } catch (error) {
      Alert.alert('Error', 'Failed to save file.');
      console.error('Error saving file:', error);
    }
  };

  const handleDeleteFile = (id: string) => {
    Alert.alert(
      'Delete File',
      'Are you sure you want to delete this file?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await fileService.deleteFile(id);
              fetchFiles();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete file.');
              console.error('Error deleting file:', error);
            }
          },
        },
      ]
    );
  };

  const openCreateModal = () => {
    setEditingFile(null);
    setFormData({
      storage_path: '',
      mime_type: '',
      file_name: '',
      byte_size: '',
      is_active: true,
    });
    setShowModal(true);
  };

  const openEditModal = (item: File) => {
    setEditingFile(item);
    setFormData({
      storage_path: item.storage_path,
      mime_type: item.mime_type,
      file_name: item.file_name,
      byte_size: String(item.byte_size),
      is_active: item.is_active,
    });
    setShowModal(true);
  };

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Loading Files...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={openCreateModal}>
        <FontAwesome name="plus" size={20} color="white" />
        <Text style={styles.addButtonText}>Add New File</Text>
      </TouchableOpacity>
      <FlatList
        data={files}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <View>
              <Text style={styles.itemName}>{item.file_name}</Text>
              <Text style={styles.itemDescription}>{item.mime_type} ({item.byte_size} bytes)</Text>
            </View>
            <View style={styles.itemActions}>
              <TouchableOpacity onPress={() => openEditModal(item)} style={styles.actionButton}>
                <FontAwesome name="edit" size={20} color="#007AFF" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteFile(item.id)} style={styles.actionButton}>
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
            <Text style={styles.modalTitle}>{editingFile ? 'Edit File' : 'Create File'}</Text>
            <TouchableOpacity onPress={handleSaveFile}>
              <Text style={styles.saveButton}>Save</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            <Text style={styles.label}>Storage Path:</Text>
            <TextInput
              style={styles.input}
              value={formData.storage_path}
              onChangeText={(text) => setFormData({ ...formData, storage_path: text })}
              placeholder="e.g., public/images/my-image.jpg"
            />
            <Text style={styles.label}>MIME Type:</Text>
            <TextInput
              style={styles.input}
              value={formData.mime_type}
              onChangeText={(text) => setFormData({ ...formData, mime_type: text })}
              placeholder="e.g., image/jpeg"
            />
            <Text style={styles.label}>File Name:</Text>
            <TextInput
              style={styles.input}
              value={formData.file_name}
              onChangeText={(text) => setFormData({ ...formData, file_name: text })}
              placeholder="e.g., my-image.jpg"
            />
            <Text style={styles.label}>Byte Size:</Text>
            <TextInput
              style={styles.input}
              value={formData.byte_size}
              onChangeText={(text) => setFormData({ ...formData, byte_size: text })}
              keyboardType="numeric"
              placeholder="e.g., 1024"
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