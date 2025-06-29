import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Text, View } from '@/components/Themed';
import { externalUserService } from '../../features/external-users/services/externalUserService';
import { ExternalUser } from '../../features/external-users/types';

export default function ExternalUsersScreen() {
  const [externalUsers, setExternalUsers] = useState<ExternalUser[]>([]);
  const [loading, setLoading] = useState(true);

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
      <FlatList
        data={externalUsers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemName}>External System: {item.external_system}</Text>
            <Text style={styles.itemDescription}>External User ID: {item.external_user_id}</Text>
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