// screens/MyPrescriptionsScreen.js (Patient View)
import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  Alert,
  StyleSheet,
  ActivityIndicator,
  RefreshControl 
} from 'react-native';
import { getPrescriptionsByPatient } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MyPrescriptionsScreen({ navigation }) {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const userRaw = await AsyncStorage.getItem('userData');
      const user = userRaw ? JSON.parse(userRaw) : null;
      
      if (!user) {
        Alert.alert('Error', 'Please log in to view prescriptions');
        return;
      }

      const patientId = user.patient_id || user.id;
      if (!patientId) {
        Alert.alert('Error', 'Patient ID not found');
        return;
      }

      console.log('🔍 Fetching prescriptions for patient:', patientId);
      const data = await getPrescriptionsByPatient(patientId);
      setPrescriptions(Array.isArray(data) ? data : []);
      
    } catch (err) {
      console.error('❌ Fetch prescriptions error:', err);
      Alert.alert('Error', 'Failed to load prescriptions');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchPrescriptions();
  };

  const navigateToPrescription = (prescription) => {
    navigation.navigate('PrescriptionDetails', { 
      prescriptionId: prescription.prescription_id 
    });
  };

  const renderPrescription = ({ item }) => (
    <TouchableOpacity 
      style={styles.prescriptionCard}
      onPress={() => navigateToPrescription(item)}
    >
      <View style={styles.prescriptionHeader}>
        <Text style={styles.prescriptionId}>
          Prescription #{item.prescription_id}
        </Text>
        <Text style={styles.prescriptionDate}>
          {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </View>
      
      <View style={styles.prescriptionDetails}>
        <Text style={styles.doctorName}>
          Dr. {item.doctor_name || 'Unknown'}
        </Text>
        {item.specialization && (
          <Text style={styles.specialization}>{item.specialization}</Text>
        )}
        {item.scheduled_at && (
          <Text style={styles.appointmentDate}>
            Appointment: {new Date(item.scheduled_at).toLocaleDateString()}
          </Text>
        )}
      </View>

      {item.notes && (
        <View style={styles.notesPreview}>
          <Text style={styles.notesText} numberOfLines={2}>
            {item.notes}
          </Text>
        </View>
      )}

      <Text style={styles.viewMore}>Tap to view details →</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading prescriptions...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Prescriptions</Text>
        <Text style={styles.subtitle}>
          {prescriptions.length} prescription{prescriptions.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <FlatList
        data={prescriptions}
        keyExtractor={item => String(item.prescription_id)}
        renderItem={renderPrescription}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={['#007AFF']}
          />
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No prescriptions yet</Text>
            <Text style={styles.emptyText}>
              Your prescriptions from doctors will appear here
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  listContainer: {
    padding: 16,
  },
  prescriptionCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  prescriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  prescriptionId: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  prescriptionDate: {
    fontSize: 14,
    color: '#666',
  },
  prescriptionDetails: {
    marginBottom: 8,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#007AFF',
    marginBottom: 4,
  },
  specialization: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  appointmentDate: {
    fontSize: 14,
    color: '#666',
  },
  notesPreview: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 8,
  },
  notesText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  viewMore: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
    textAlign: 'right',
    marginTop: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    lineHeight: 24,
  },
});