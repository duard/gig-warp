import React from 'react';
import { StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useSupabase } from '../../providers/SupabaseProvider';

export default function ProfileScreen() {
  const { user, signOut, loading } = useSupabase();

  const handleEditProfile = () => {
    // Navigate to edit profile screen
    router.push('/features/users');
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: signOut,
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={[styles.container, styles.centered]}>
        <FontAwesome name="user-circle" size={80} color="#ccc" />
        <Text style={styles.notLoggedInText}>Not logged in</Text>
        <Text style={styles.notLoggedInSubtext}>Please log in to view your profile</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <FontAwesome name="user-circle" size={80} color="#007AFF" />
        </View>
        <Text style={styles.name}>{user.user_metadata?.full_name || 'User'}</Text>
        <Text style={styles.email}>{user.email}</Text>
        <Text style={styles.userId}>ID: {user.id.substring(0, 8)}...</Text>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.menuItem} onPress={handleEditProfile}>
          <FontAwesome name="edit" size={20} color="#007AFF" />
          <Text style={styles.menuText}>Edit Profile</Text>
          <FontAwesome name="chevron-right" size={16} color="#ccc" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <FontAwesome name="cog" size={20} color="#007AFF" />
          <Text style={styles.menuText}>Settings</Text>
          <FontAwesome name="chevron-right" size={16} color="#ccc" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <FontAwesome name="question-circle" size={20} color="#007AFF" />
          <Text style={styles.menuText}>Help & Support</Text>
          <FontAwesome name="chevron-right" size={16} color="#ccc" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <TouchableOpacity 
          style={[styles.menuItem, styles.signOutButton]}
          onPress={handleSignOut}
        >
          <FontAwesome name="sign-out" size={20} color="#ff4444" />
          <Text style={[styles.menuText, styles.signOutText]}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: 'white',
    alignItems: 'center',
    padding: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  userId: {
    fontSize: 12,
    color: '#999',
  },
  section: {
    marginTop: 20,
    backgroundColor: 'white',
    marginHorizontal: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
  },
  signOutButton: {
    borderBottomWidth: 0,
  },
  signOutText: {
    color: '#ff4444',
  },
  notLoggedInText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#9e9e9e',
    marginTop: 16,
  },
  notLoggedInSubtext: {
    fontSize: 14,
    color: '#bdbdbd',
    textAlign: 'center',
    marginTop: 8,
  },
});

