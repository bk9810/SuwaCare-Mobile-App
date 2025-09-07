// src/screens/BookAppointmentScreen.jsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getDoctors, bookAppointment } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function BookAppointmentScreen({navigation, patientId: propPatientId }) {
  const [patientId, setPatientId] = useState(propPatientId);
  const [department, setDepartment] = useState('');
  const [departments] = useState([
    'Diabetes',
    'Cardiology',
    'Pulmonology',
    'Nephrology',
    'Neurology',
    'General Medicine',
    'Hypertension'
  ]);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [reason, setReason] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [loading, setLoading] = useState(false);
  const [doctorsLoading, setDoctorsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Get patient ID from AsyncStorage if not provided as prop
  useEffect(() => {
    const initializePatientId = async () => {
      if (!patientId) {
        try {
          // Try to get patient info from stored user data
          const userData = await AsyncStorage.getItem('userData');
          if (userData) {
            const parsed = JSON.parse(userData);
            const extractedPatientId = parsed.patient?.id || parsed.id || parsed.patient_id;
            console.log('📋 Retrieved patient ID from storage:', extractedPatientId);
            setPatientId(extractedPatientId);
          }
        } catch (error) {
          console.error('❌ Error getting patient ID:', error);
        }
      }

      // Debug token
      try {
        const token = await AsyncStorage.getItem('token');
        console.log('🔍 Current Token Debug:', {
          hasToken: !!token,
          tokenLength: token?.length,
          tokenPreview: token ? `${token.substring(0, 30)}...` : 'No token stored'
        });
      } catch (error) {
        console.error('❌ Error getting token:', error);
      }
    };
    initializePatientId();
  }, []);

  // Load doctors when department changes
  useEffect(() => {
    const loadDoctors = async () => {
      if (!department) {
        setDoctors([]);
        setSelectedDoctorId('');
        setMessage('');
        return;
      }

      try {
        setDoctorsLoading(true);
        setMessage('');
        setSelectedDoctorId(''); // Reset selected doctor when department changes
        
        // Check if user is logged in before fetching doctors
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          setMessage('Please log in first to view doctors.');
          setDoctors([]);
          return;
        }
        
        console.log('🏥 Fetching doctors for department:', department);
        
        // Call getDoctors with the department parameter
        const docs = await getDoctors(department);
        
        console.log('👨‍⚕️ Raw doctors response:', docs);
        
        // Ensure docs is an array
        const doctorsArray = Array.isArray(docs) ? docs : [];
        
        console.log('👨‍⚕️ Processed doctors:', {
          count: doctorsArray.length,
          doctors: doctorsArray.map(d => ({
            id: d.doctor_id,
            name: d.name,
            specialization: d.specialization,
            status: d.status
          }))
        });
        
        if (doctorsArray.length === 0) {
          setMessage(`No approved doctors found for ${department} department.`);
        }
        
        setDoctors(doctorsArray);
        
      } catch (err) {
        console.error('❌ Error fetching doctors:', err.response?.data || err.message);
        
        if (err.message.includes('authentication') || err.message.includes('log in')) {
          setMessage('Please log in first to view doctors.');
        } else if (err.response?.status === 401) {
          setMessage('Session expired. Please log in again.');
        } else if (err.response?.status === 500) {
          setMessage('Server error. Please try again later.');
        } else {
          setMessage('Failed to fetch doctors. Please check your connection.');
        }
        setDoctors([]);
      } finally {
        setDoctorsLoading(false);
      }
    };

    loadDoctors();
  }, [department]);

  const handleSubmit = async () => {
    // Validation
    if (!department) {
      setMessage('Please select a department.');
      return;
    }
    
    if (!selectedDoctorId) {
      setMessage('Please select a doctor.');
      return;
    }
    
    if (!patientId) {
      setMessage('Patient ID is required. Please log in again.');
      return;
    }

    // Find the selected doctor for debugging
    const selectedDoctor = doctors.find(d => d.doctor_id.toString() === selectedDoctorId);
    
    console.log('📋 Booking appointment debug:', {
      selectedDoctorId,
      selectedDoctorIdType: typeof selectedDoctorId,
      selectedDoctor,
      availableDoctors: doctors.map(d => ({ id: d.doctor_id, name: d.name })),
      patient_id: patientId,
      department,
    });
    
    try {
      setLoading(true);
      setMessage('');
      
      // Debug current token
      const token = await AsyncStorage.getItem('token');
      console.log('🔍 Token before booking:', {
        hasToken: !!token,
        tokenPreview: token ? `${token.substring(0, 20)}...` : 'No token'
      });
      
      if (!token) {
        setMessage('Please log in first to book an appointment.');
        return;
      }
      
      const payload = {
        patient_id: patientId,
        doctor_id: parseInt(selectedDoctorId), // Ensure it's a number
        department,
        reason: reason.trim() || null,
        scheduled_at: scheduledAt.trim() || null,
      };
      
      const response = await bookAppointment(payload);
      
      console.log('✅ Appointment booked successfully:', response);
      setMessage('Appointment requested successfully! The doctor will review your request.');
      
      // Clear form after successful booking
      setDepartment('');
      setSelectedDoctorId('');
      setReason('');
      setScheduledAt('');
      setDoctors([]); // Clear doctors list too
      
    } catch (err) {
      console.error('❌ Booking error:', {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        message: err.message
      });
      
      if (err.response?.status === 401) {
        setMessage('Authentication failed. Please log in again.');
      } else if (err.response?.status === 400) {
        setMessage(err.response?.data?.message || 'Invalid appointment data.');
      } else if (err.response?.status === 404) {
        setMessage('Selected doctor not found. Please choose another doctor.');
      } else {
        setMessage(err.response?.data?.message || 'Failed to book appointment. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDepartmentChange = (value) => {
    setDepartment(value);
    // Clear doctor selection when department changes
    setSelectedDoctorId('');
    setMessage('');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formSection}>
        <Text style={styles.title}>Book Appointment</Text>

      
        <Text style={styles.label}>Department *</Text>
        <View style={styles.pickerContainer}>
          <Picker 
            selectedValue={department} 
            onValueChange={handleDepartmentChange}
            style={styles.picker}
          >
            <Picker.Item label="Select department" value="" />
            {departments.map((d) => (
              <Picker.Item key={d} label={d} value={d} />
            ))}
          </Picker>
        </View>

        
        <Text style={styles.label}>Doctor *</Text>
        {doctorsLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#2c5aa0" />
            <Text style={styles.loadingText}>Loading doctors...</Text>
          </View>
        ) : (
          <View style={styles.pickerContainer}>
            <Picker 
              selectedValue={selectedDoctorId} 
              onValueChange={setSelectedDoctorId}
              style={styles.picker}
              enabled={doctors.length > 0}
            >
              <Picker.Item 
                label={doctors.length > 0 ? "Select doctor" : "No doctors available"} 
                value="" 
              />
              {doctors.map((doc) => (
                <Picker.Item
                  key={doc.doctor_id}
                  label={`Dr. ${doc.name} — ${doc.specialization}`}
                  value={doc.doctor_id.toString()}
                />
              ))}
            </Picker>
          </View>
        )}

        
        {department && (
          <Text style={styles.debugText}>
            Debug: {doctors.length} doctors found for {department}
          </Text>
        )}

      
        <Text style={styles.label}>Reason for Visit</Text>
        <TextInput
          value={reason}
          onChangeText={setReason}
          placeholder="Describe your symptoms or reason for visit"
          style={styles.input}
          multiline
          numberOfLines={3}
        />

        
        <Text style={styles.label}>Preferred Date/Time</Text>
        <TextInput
          value={scheduledAt}
          onChangeText={setScheduledAt}
          placeholder="YYYY-MM-DD HH:mm (e.g., 2024-12-25 14:30)"
          style={styles.input}
        />

        
        <View style={[
          styles.submitButton, 
          (loading || !department || !selectedDoctorId) && styles.submitButtonDisabled
        ]}>
          <Button 
            title={loading ? "Booking..." : "Book Appointment"}
            onPress={handleSubmit} 
            disabled={loading || !department || !selectedDoctorId}
            color="#ffffff"
          />
        </View>

        
        {message ? (
          <View style={[
            styles.messageContainer,
            message.includes('success') ? styles.successMessage : styles.errorMessage
          ]}>
            <Text style={[
              styles.messageText,
              message.includes('success') ? styles.successText : styles.errorText
            ]}>
              {message}
            </Text>
          </View>
        ) : null}


      </View>
      <View>
        
         <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('MyAppointmentsScreen')}
              >
                <Text style={styles.buttonText}>View Book Appointment</Text>
              </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#f8fffe',
  },
  formSection: {
    backgroundColor: '#ffffff',
    padding: 20,
    margin: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  title: { 
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 25,
    textAlign: 'center',
    color: '#2c5aa0',
    letterSpacing: 0.5,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4a6741',
    marginTop: 15,
    marginBottom: 8,
  },
  pickerContainer: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#cbd5e0',
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  picker: {
    height: 50,
    color: '#2d3748',
  },
  input: {
    borderWidth: 2,
    borderColor: '#cbd5e0',
    padding: 16,
    marginBottom: 15,
    borderRadius: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
    color: '#2d3748',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  submitButton: {
    backgroundColor: '#48bb78',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 15,
    shadowColor: '#48bb78',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  submitButtonDisabled: {
    backgroundColor: '#a0aec0',
    shadowOpacity: 0.1,
  },
  loadingContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loadingText: {
    marginTop: 10,
    color: '#4a6741',
    fontSize: 16,
    fontWeight: '500',
  },
  messageContainer: {
    marginTop: 15,
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
  },
  successMessage: {
    backgroundColor: '#f0fff4',
    borderLeftWidth: 5,
    borderLeftColor: '#48bb78',
  },
  errorMessage: {
    backgroundColor: '#fed7d7',
    borderLeftWidth: 5,
    borderLeftColor: '#e53e3e',
  },
  messageText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  successText: {
    color: '#2f855a',
  },
  errorText: {
    color: '#c53030',
  },
  debugText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 10,
  },
    button: {
    width: '95%',
    backgroundColor: '#48bb78',
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderRadius: 15,
    marginVertical: 12,
    alignItems: 'center',
    shadowColor: '#48bb78',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 8,
    elevation: 8,
    borderLeftWidth: 6,
    borderLeftColor: '#38a169',
    transform: [{ scale: 1 }],
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
});