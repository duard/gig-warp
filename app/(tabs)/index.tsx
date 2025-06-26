import { StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Home!</Text>
      <Text style={styles.subtitle}>Your Expo Router + Supabase App</Text>
      
      <View style={styles.featuresContainer}>
        <TouchableOpacity 
          style={styles.featureButton}
          onPress={() => router.push('/users')}
        >
          <FontAwesome name="users" size={24} color="white" />
          <Text style={styles.featureButtonText}>User Management</Text>
          <Text style={styles.featureButtonSubtext}>Create, Edit & Manage Users</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.featureButton, styles.secondaryButton]}
          onPress={() => router.push('/(tabs)/checklist')}
        >
          <FontAwesome name="list" size={24} color="#007AFF" />
          <Text style={[styles.featureButtonText, styles.secondaryButtonText]}>Checklists</Text>
          <Text style={[styles.featureButtonSubtext, styles.secondaryButtonSubtext]}>Manage Your Tasks</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="app/(tabs)/index.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    marginBottom: 30,
  },
  featuresContainer: {
    width: '100%',
    maxWidth: 400,
    gap: 16,
  },
  featureButton: {
    backgroundColor: '#007AFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  featureButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginTop: 8,
  },
  secondaryButtonText: {
    color: '#007AFF',
  },
  featureButtonSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
    textAlign: 'center',
  },
  secondaryButtonSubtext: {
    color: '#666',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
