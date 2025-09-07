// screens/CreatePrescriptionScreen.js - Fixed Version
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  ScrollView,
  StyleSheet,
  ActivityIndicator 
} from 'react-native';
import { createPrescription } from '../services/api';

export default function CreatePrescriptionScreen({ route, navigation }) {
  const { appointmentId, patientName, appointmentDate } = route.params || {};
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  // Check for required parameters on mount
  useEffect(() => {
    console.log('CreatePrescription route params:', route.params);
    
    if (!appointmentId) {
      Alert.alert(
        'Missing Information', 
        'No appointment ID provided. Please select an appointment first.',
        [
          {
            text: 'Go Back',
            onPress: () => navigation.goBack()
          }
        ]
      );
    }
  }, [appointmentId, navigation]);

  const handleCreate = async () => {
    if (!appointmentId) {
      return Alert.alert('Error', 'No appointment ID available');
    }

    if (!notes.trim()) {
      return Alert.alert('Validation', 'Please add some notes or instructions');
    }

    setLoading(true);
    try {
      console.log('Creating prescription for appointment:', appointmentId);
      
      const response = await createPrescription({ 
        appointment_id: appointmentId, 
        notes: notes.trim() 
      });
      
      const prescription = response.prescription;
      
      Alert.alert(
        'Success', 
        'Prescription created successfully!',
        [
          {
            text: 'Add Medicines',
            onPress: () => navigation.replace('PrescriptionDetails', { 
              prescriptionId: prescription.prescription_id 
            })
          },
          {
            text: 'Done',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (err) {
      console.error('Create prescription error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create prescription';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Show loading or error state if no appointment ID
  if (!appointmentId) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Missing Appointment Information</Text>
        <Text style={styles.errorText}>
          Please select an appointment first to create a prescription.
        </Text>
        <TouchableOpacity 
          style={styles.goBackButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.goBackText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Create Prescription</Text>
        <Text style={styles.subtitle}>Patient: {patientName || 'Unknown'}</Text>
        <Text style={styles.subtitle}>
          Date: {appointmentDate ? new Date(appointmentDate).toLocaleDateString() : 'N/A'}
        </Text>
        <Text style={styles.appointmentId}>Appointment ID: {appointmentId}</Text>
      </View>

      <View style={styles.formSection}>
        <Text style={styles.label}>Notes & Instructions *</Text>
        <TextInput
          placeholder="Enter prescription notes, general instructions, or medical advice..."
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={6}
          style={styles.notesInput}
          textAlignVertical="top"
        />
        <Text style={styles.hint}>
          Add general medical advice, follow-up instructions, or any important notes for the patient.
        </Text>
      </View>

      <TouchableOpacity 
        onPress={handleCreate} 
        disabled={loading || !notes.trim()}
        style={[styles.createButton, (!notes.trim() || loading) && styles.disabledButton]}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Create Prescription</Text>
        )}
      </TouchableOpacity>
       
    </ScrollView>

    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  appointmentId: {
    fontSize: 14,
    color: '#999',
    fontFamily: 'monospace',
    marginTop: 8,
  },
  formSection: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 120,
    backgroundColor: '#fafafa',
  },
  hint: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
    fontStyle: 'italic',
  },
  createButton: {
    backgroundColor: '#007AFF',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  // Error state styles
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#f5f5f5',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginBottom: 12,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  goBackButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  goBackText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});