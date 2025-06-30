import React, { useState } from 'react';
import { Modal, StyleSheet, TextInput, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Text, View } from '@/components/Themed';

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

export default function SearchableSelect({
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
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity style={styles.inputContainer} onPress={() => setModalVisible(true)}>
        <TextInput
          style={styles.input}
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
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <FontAwesome name="times" size={24} color="#007AFF" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{label || placeholder || 'Select an Option'}</Text>
          </View>
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            value={searchText}
            onChangeText={setSearchText}
          />
          <FlatList
            data={filteredOptions}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.optionItem}
                onPress={() => handleSelect(item.value)}
              >
                <Text style={styles.optionText}>{item.label}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
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