// Fixed DoctorAppointmentsScreen.jsx with Prescription Navigation
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDoctorAppointments, updateAppointmentStatus } from '../services/api';

export default function DoctorAppointmentsScreen({ navigation, doctorId: propDoctorId }) {
  const [doctorId, setDoctorId] = useState(propDoctorId);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Initialize doctor ID from AsyncStorage if not provided as prop
  useEffect(() => {
    const initializeDoctorId = async () => {
      try {
        let finalDoctorId = propDoctorId;
        
        if (!finalDoctorId) {
          // Try to get doctor ID from stored user data
          const userData = await AsyncStorage.getItem('userData');
          if (userData) {
            const parsed = JSON.parse(userData);
            
            // Check if this is doctor data (not patient data)
            if (parsed.type === 'doctor' || parsed.doctor_id || parsed.specialization) {
              finalDoctorId = parsed.id || parsed.doctor_id;
              console.log('Retrieved doctor ID from storage:', finalDoctorId);
            } else {
              // This is patient data, not doctor data
              setError('You are logged in as a patient. Please log in as a doctor to view appointments.');
              return;
            }
          } else {
            setError('No user data found. Please log in as a doctor first.');
            return;
          }
        }
        
        setDoctorId(finalDoctorId);
        setError(''); // Clear any previous errors
        
      } catch (error) {
        console.error('Error getting doctor ID:', error);
        setError('Error retrieving doctor information.');
      }
    };
    
    initializeDoctorId();
  }, [propDoctorId]);

  const fetchAppointments = async () => {
    if (!doctorId) {
      console.log('No doctorId available, skipping fetch');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      console.log('Fetching appointments for doctor ID:', doctorId);
      const data = await getDoctorAppointments(doctorId);
      
      console.log('Appointments fetched:', {
        count: Array.isArray(data) ? data.length : 'not array',
        data: data
      });
      
      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Fetch appointments error:', err);
      setError('Failed to fetch appointments. Please try again.');
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (doctorId && !error) {
      fetchAppointments();
    }
  }, [doctorId]);

  const handleUpdate = async (appointmentId, status) => {
    try {
      console.log('Updating appointment:', appointmentId, 'to', status);
      await updateAppointmentStatus(appointmentId, { status });
      fetchAppointments(); // Refresh the list
    } catch (err) {
      console.error('Status update error:', err);
      Alert.alert("Error", "Failed to update status");
    }
  };

  const navigateToCreatePrescription = (appointment) => {
    if (appointment.status !== 'ACCEPTED') {
      Alert.alert(
        'Invalid Action', 
        'You can only create prescriptions for accepted appointments.'
      );
      return;
    }

    navigation.navigate('CreatePrescription', {
      appointmentId: appointment.appointment_id,
      patientName: appointment.patient_name,
      appointmentDate: appointment.scheduled_at,
    });
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.bold}>
          {item.patient_name} ({item.patient_email})
        </Text>
        <Text style={styles.appointmentId}>ID: {item.appointment_id}</Text>
      </View>
      
      <Text style={styles.detail}>Department: {item.department}</Text>
      <Text style={styles.detail}>Reason: {item.reason}</Text>
      <Text style={styles.detail}>
        Scheduled At:{' '}
        {item.scheduled_at ? new Date(item.scheduled_at).toLocaleString() : 'Not specified'}
      </Text>
      <Text style={[styles.status, 
        item.status === 'PENDING' && styles.pendingStatus,
        item.status === 'ACCEPTED' && styles.acceptedStatus,
        item.status === 'REJECTED' && styles.rejectedStatus
      ]}>
        Status: {item.status}
      </Text>

      <View style={styles.actionContainer}>
        {item.status === 'PENDING' && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.actionButton, styles.acceptButton]}
              onPress={() => handleUpdate(item.appointment_id, 'ACCEPTED')}
            >
              <Text style={styles.buttonText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.rejectButton]}
              onPress={() => handleUpdate(item.appointment_id, 'REJECTED')}
            >
              <Text style={styles.buttonText}>Reject</Text>
            </TouchableOpacity>
          </View>
        )}

        {item.status === 'ACCEPTED' && (
          <TouchableOpacity
            style={[styles.actionButton, styles.prescriptionButton]}
            onPress={() => navigateToCreatePrescription(item)}
          >
            <Text style={styles.buttonText}>Create Prescription</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Appointments (Doctor)</Text>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button title="Retry" onPress={() => setError('')} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Appointments</Text>
      
      {/* Show current doctor info */}
      {doctorId && (
        <Text style={styles.doctorInfo}>Doctor ID: {doctorId}</Text>
      )}
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text>Loading appointments...</Text>
        </View>
      ) : appointments.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No appointments found</Text>
          <Button title="Refresh" onPress={fetchAppointments} />
        </View>
      ) : (
        <FlatList
          data={appointments}
          keyExtractor={(item) => item.appointment_id.toString()}
          renderItem={renderItem}
          refreshing={loading}
          onRefresh={fetchAppointments}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5'
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 15,
    textAlign: 'center',
    color: '#333'
  },
  doctorInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    textAlign: 'center'
  },
  card: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bold: { 
    fontWeight: 'bold',
    fontSize: 16,
    flex: 1,
    color: '#333'
  },
  appointmentId: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'monospace',
  },
  detail: {
    fontSize: 14,
    marginBottom: 4,
    color: '#555'
  },
  status: {
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 8,
    fontSize: 15,
  },
  pendingStatus: {
    color: '#FF9800'
  },
  acceptedStatus: {
    color: '#4CAF50'
  },
  rejectedStatus: {
    color: '#f44336'
  },
  actionContainer: {
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 6,
    alignItems: 'center',
    minHeight: 40,
    justifyContent: 'center',
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#f44336',
  },
  prescriptionButton: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f44336',
    alignItems: 'center'
  },
  errorText: {
    color: '#c62828',
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 16
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15
  }
});