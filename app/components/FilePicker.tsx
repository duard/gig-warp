import React from 'react';
import { TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Text, View } from '@/components/Themed';
import * as DocumentPicker from 'expo-document-picker';

interface FilePickerProps {
  onSelect: (uri: string, name: string, mimeType: string, size: number) => void;
  label?: string;
  buttonText?: string;
}

export default function FilePicker({
  onSelect,
  label,
  buttonText = 'Select File',
}: FilePickerProps) {
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: false,
      });

      if (result.canceled === false && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        onSelect(asset.uri, asset.name, asset.mimeType || '', asset.size || 0);
      } else {
        console.log('Document picking cancelled or no assets selected');
      }
    } catch (err) {
      console.error('Error picking document:', err);
      Alert.alert('Error', 'Failed to pick document.');
    }
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity style={styles.button} onPress={pickDocument}>
        <FontAwesome name="upload" size={20} color="white" />
        <Text style={styles.buttonText}>{buttonText}</Text>
      </TouchableOpacity>
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
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});