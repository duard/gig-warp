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
            style={styles.featureButton}
            onPress={() => router.push('/features/status-types')}
          >
            <FontAwesome name="info-circle" size={24} color="white" />
            <Text style={styles.featureButtonText}>Status Types</Text>
            <Text style={styles.featureButtonSubtext}>Manage Status Definitions</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.featureButton, styles.secondaryButton]}
            onPress={() => router.push('/features/answer-types')}
          >
            <FontAwesome name="question-circle" size={24} color="#007AFF" />
            <Text style={[styles.featureButtonText, styles.secondaryButtonText]}>Answer Types</Text>
            <Text style={[styles.featureButtonSubtext, styles.secondaryButtonSubtext]}>Define Question Answer Types</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.featureButton}
            onPress={() => router.push('/features/task-lists')}
          >
            <FontAwesome name="tasks" size={24} color="white" />
            <Text style={styles.featureButtonText}>Task Lists</Text>
            <Text style={styles.featureButtonSubtext}>Manage Task Definitions</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.featureButton, styles.secondaryButton]}
            onPress={() => router.push('/features/questions')}
          >
            <FontAwesome name="question-circle" size={24} color="#007AFF" />
            <Text style={[styles.featureButtonText, styles.secondaryButtonText]}>Questions</Text>
            <Text style={[styles.featureButtonSubtext, styles.secondaryButtonSubtext]}>Manage Questions</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.featureButton}
            onPress={() => router.push('/features/responses')}
          >
            <FontAwesome name="reply-all" size={24} color="white" />
            <Text style={styles.featureButtonText}>Responses</Text>
            <Text style={styles.featureButtonSubtext}>View User Responses</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.featureButton, styles.secondaryButton]}
            onPress={() => router.push('/features/answers')}
          >
            <FontAwesome name="check-square" size={24} color="#007AFF" />
            <Text style={[styles.featureButtonText, styles.secondaryButtonText]}>Answers</Text>
            <Text style={[styles.featureButtonSubtext, styles.secondaryButtonSubtext]}>Manage Question Answers</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.featureButton}
            onPress={() => router.push('/features/files')}
          >
            <FontAwesome name="file" size={24} color="white" />
            <Text style={styles.featureButtonText}>Files</Text>
            <Text style={styles.featureButtonSubtext}>Manage Files</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.featureButton, styles.secondaryButton]}
            onPress={() => router.push('/features/approvals')}
          >
            <FontAwesome name="thumbs-up" size={24} color="#007AFF" />
            <Text style={[styles.featureButtonText, styles.secondaryButtonText]}>Approvals</Text>
            <Text style={[styles.featureButtonSubtext, styles.secondaryButtonSubtext]}>Manage Approvals</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.featureButton}
            onPress={() => router.push('/features/comments')}
          >
            <FontAwesome name="comments" size={24} color="white" />
            <Text style={styles.featureButtonText}>Comments</Text>
            <Text style={styles.featureButtonSubtext}>Manage Comments</Text>
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