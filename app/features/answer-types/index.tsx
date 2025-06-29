import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Text, View } from '@/components/Themed';
import { answerTypeService } from '../../features/answer-types/services/answerTypeService';
import { AnswerType } from '../../features/answer-types/types';

export default function AnswerTypesScreen() {
  const [answerTypes, setAnswerTypes] = useState<AnswerType[]>([]);
  const [loading, setLoading] = useState(true);

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
      <FlatList
        data={answerTypes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemDescription}>{item.description}</Text>
          </View>
        )}
      />
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
});