import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import { commentService } from '../../features/comments/services/commentService';
import { Comment } from '../../features/comments/types';

export default function CommentsScreen() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [formData, setFormData] = useState({
    target_type: '',
    target_id: '',
    user_id: '',
    content: '',
    status_id: '',
    is_active: true,
  });

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const data = await commentService.getAllComments();
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveComment = async () => {
    try {
      if (editingComment) {
        await commentService.updateComment(editingComment.id, formData);
      } else {
        await commentService.createComment(formData);
      }
      setShowModal(false);
      setEditingComment(null);
      setFormData({
        target_type: '',
        target_id: '',
        user_id: '',
        content: '',
        status_id: '',
        is_active: true,
      });
      fetchComments();
    } catch (error) {
      Alert.alert('Error', 'Failed to save comment.');
      console.error('Error saving comment:', error);
    }
  };

  const handleDeleteComment = (id: string) => {
    Alert.alert(
      'Delete Comment',
      'Are you sure you want to delete this comment?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await commentService.deleteComment(id);
              fetchComments();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete comment.');
              console.error('Error deleting comment:', error);
            }
          },
        },
      ]
    );
  };

  const openCreateModal = () => {
    setEditingComment(null);
    setFormData({
      target_type: '',
      target_id: '',
      user_id: '',
      content: '',
      status_id: '',
      is_active: true,
    });
    setShowModal(true);
  };

  const openEditModal = (item: Comment) => {
    setEditingComment(item);
    setFormData({
      target_type: item.target_type,
      target_id: item.target_id,
      user_id: item.user_id,
      content: item.content,
      status_id: item.status_id || '',
      is_active: item.is_active,
    });
    setShowModal(true);
  };

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Loading Comments...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={openCreateModal}>
        <FontAwesome name="plus" size={20} color="white" />
        <Text style={styles.addButtonText}>Add New Comment</Text>
      </TouchableOpacity>
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <View>
              <Text style={styles.itemName}>User ID: {item.user_id}</Text>
              <Text style={styles.itemDescription}>Content: {item.content}</Text>
            </View>
            <View style={styles.itemActions}>
              <TouchableOpacity onPress={() => openEditModal(item)} style={styles.actionButton}>
                <FontAwesome name="edit" size={20} color="#007AFF" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteComment(item.id)} style={styles.actionButton}>
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
            <Text style={styles.modalTitle}>{editingComment ? 'Edit Comment' : 'Create Comment'}</Text>
            <TouchableOpacity onPress={handleSaveComment}>
              <Text style={styles.saveButton}>Save</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            <Text style={styles.label}>Target Type:</Text>
            <TextInput
              style={styles.input}
              value={formData.target_type}
              onChangeText={(text) => setFormData({ ...formData, target_type: text })}
              placeholder="e.g., response, question"
            />
            <Text style={styles.label}>Target ID:</Text>
            <TextInput
              style={styles.input}
              value={formData.target_id}
              onChangeText={(text) => setFormData({ ...formData, target_id: text })}
              placeholder="Target ID"
            />
            <Text style={styles.label}>User ID:</Text>
            <TextInput
              style={styles.input}
              value={formData.user_id}
              onChangeText={(text) => setFormData({ ...formData, user_id: text })}
              placeholder="User ID"
            />
            <Text style={styles.label}>Content:</Text>
            <TextInput
              style={styles.input}
              value={formData.content}
              onChangeText={(text) => setFormData({ ...formData, content: text })}
              placeholder="Comment content"
              multiline
            />
            <Text style={styles.label}>Status ID:</Text>
            <TextInput
              style={styles.input}
              value={formData.status_id}
              onChangeText={(text) => setFormData({ ...formData, status_id: text })}
              placeholder="Status ID"
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