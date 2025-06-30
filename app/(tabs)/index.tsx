import { StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';

import { Text, View } from '@/components/Themed';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.featuresContainer}>
          <TouchableOpacity 
            style={styles.featureButton}
            onPress={() => router.push('/features/checklist-manager' as any)}
          >
            <FontAwesome name="list-alt" size={24} color="white" />
            <Text style={styles.featureButtonText}>Checklist Manager</Text>
            <Text style={styles.featureButtonSubtext}>Manage all Checklist-related Modules</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.featureButton}
            onPress={() => router.push('/features/users')}
          >
            <FontAwesome name="users" size={24} color="white" />
            <Text style={styles.featureButtonText}>User Management</Text>
            <Text style={styles.featureButtonSubtext}>Create, Edit & Manage Users</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.featureButton, styles.secondaryButton]}
            onPress={() => router.push('/(tabs)/todos')}
          >
            <FontAwesome name="check-square-o" size={24} color="#007AFF" />
            <Text style={[styles.featureButtonText, styles.secondaryButtonText]}>Todos</Text>
            <Text style={[styles.featureButtonSubtext, styles.secondaryButtonSubtext]}>Manage Your Tasks</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.featureButton}
            onPress={() => router.push('/features/requisicoes')}
          >
            <FontAwesome name="file-text-o" size={24} color="white" />
            <Text style={styles.featureButtonText}>Requisições</Text>
            <Text style={styles.featureButtonSubtext}>Gerenciar Requisições</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.featureButton, styles.secondaryButton]}
            onPress={() => router.push('/features/compras')}
          >
            <FontAwesome name="shopping-cart" size={24} color="#007AFF" />
            <Text style={[styles.featureButtonText, styles.secondaryButtonText]}>Compras</Text>
            <Text style={[styles.featureButtonSubtext, styles.secondaryButtonSubtext]}>Gerenciar Compras</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.featureButton}
            onPress={() => router.push('/features/sms')}
          >
            <FontAwesome name="shield" size={24} color="white" />
            <Text style={styles.featureButtonText}>Segurança do Trabalho</Text>
            <Text style={styles.featureButtonSubtext}>Gerenciar Segurança</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.featureButton, styles.secondaryButton]}
            onPress={() => router.push('/features/veiculos')}
          >
            <FontAwesome name="car" size={24} color="#007AFF" />
            <Text style={[styles.featureButtonText, styles.secondaryButtonText]}>Veículos</Text>
            <Text style={[styles.featureButtonSubtext, styles.secondaryButtonSubtext]}>Gerenciar Frota</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.featureButton}
            onPress={() => router.push('/features/funcionarios')}
          >
            <FontAwesome name="users" size={24} color="white" />
            <Text style={styles.featureButtonText}>Funcionários</Text>
            <Text style={styles.featureButtonSubtext}>Gerenciar Funcionários</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.featureButton, styles.secondaryButton]}
            onPress={() => router.push('/features/taxi-interno')}
          >
            <FontAwesome name="taxi" size={24} color="#007AFF" />
            <Text style={[styles.featureButtonText, styles.secondaryButtonText]}>Táxi Interno</Text>
            <Text style={[styles.featureButtonSubtext, styles.secondaryButtonSubtext]}>Solicitar Táxi</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.featureButton, styles.secondaryButton]}
            onPress={() => router.push('/features/external-users')}
          >
            <FontAwesome name="external-link" size={24} color="#007AFF" />
            <Text style={[styles.featureButtonText, styles.secondaryButtonText]}>External Users</Text>
            <Text style={[styles.featureButtonSubtext, styles.secondaryButtonSubtext]}>Manage External User Accounts</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },
  featureButton: {
    backgroundColor: '#007AFF',
    borderRadius: 16,
    width: '45%', // Approximately two columns
    aspectRatio: 1, // Make it square
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  featureButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginTop: 8,
    textAlign: 'center',
  },
  secondaryButtonText: {
    color: '#007AFF',
  },
  featureButtonSubtext: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
    textAlign: 'center',
  },
  secondaryButtonSubtext: {
    color: '#666',
  },
});