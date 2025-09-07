// screens/PrescriptionDetailsScreen.js - CLEAN VERSION WITHOUT PROBLEMATIC IMPORTS
import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  Alert,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Linking
} from 'react-native';
import { 
  getPrescriptionById, 
  addMedicineToPrescription, 
  getPrescriptionMedicines 
} from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PrescriptionDetailsScreen({ route, navigation }) {
  const { prescriptionId } = route.params || {};
  const [prescription, setPrescription] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [form, setForm] = useState({
    name: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: ''
  });
  const [loading, setLoading] = useState(false);
  const [addingMedicine, setAddingMedicine] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);

  useEffect(() => {
    if (!prescriptionId) {
      Alert.alert('Error', 'No prescription ID provided');
      navigation.goBack();
      return;
    }
    
    initializeScreen();
  }, [prescriptionId]);

  const initializeScreen = async () => {
    try {
      // Get current user info
      const userRaw = await AsyncStorage.getItem('userData');
      const user = userRaw ? JSON.parse(userRaw) : null;
      
      if (!user) {
        Alert.alert('Error', 'Please log in first', [
          { text: 'OK', onPress: () => navigation.navigate('Login') }
        ]);
        return;
      }

      setCurrentUser(user);
      console.log('👤 Current user:', user);
      
      // Verify token exists
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'Authentication token missing. Please log in again.', [
          { text: 'OK', onPress: () => navigation.navigate('Login') }
        ]);
        return;
      }

      console.log('🔑 Token verified, fetching prescription data...');
      await fetchPrescriptionData();
      
    } catch (error) {
      console.error('❌ Initialization error:', error);
      Alert.alert('Error', 'Failed to initialize screen');
    }
  };

  const fetchPrescriptionData = async () => {
    setLoading(true);
    try {
      console.log('📋 Fetching prescription:', prescriptionId);
      
      // Fetch prescription and medicines in parallel
      const [prescriptionResponse, medicinesData] = await Promise.allSettled([
        getPrescriptionById(prescriptionId),
        getPrescriptionMedicines(prescriptionId)
      ]);

      // Handle prescription response
      if (prescriptionResponse.status === 'fulfilled') {
        console.log('✅ Prescription loaded:', prescriptionResponse.value);
        setPrescription(prescriptionResponse.value.prescription || prescriptionResponse.value);
      } else {
        console.error('❌ Prescription fetch failed:', prescriptionResponse.reason);
        throw prescriptionResponse.reason;
      }

      // Handle medicines response
      if (medicinesData.status === 'fulfilled') {
        console.log('💊 Medicines loaded:', medicinesData.value);
        setMedicines(Array.isArray(medicinesData.value) ? medicinesData.value : []);
      } else {
        console.error('⚠️ Medicines fetch failed (non-critical):', medicinesData.reason);
        setMedicines([]); // Continue without medicines
      }

    } catch (error) {
      console.error('❌ Fetch prescription data error:', error);
      
      let errorMessage = 'Failed to load prescription details';
      
      if (error.response?.status === 403) {
        errorMessage = 'Access denied. You do not have permission to view this prescription.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Authentication failed. Please log in again.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Prescription not found.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Error', errorMessage, [
        { text: 'Go Back', onPress: () => navigation.goBack() },
        { text: 'Retry', onPress: () => fetchPrescriptionData() }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMedicine = async () => {
    if (!form.name.trim()) {
      return Alert.alert('Validation Error', 'Medicine name is required');
    }

    // Check if user is the prescribing doctor
    if (currentUser?.type === 'doctor') {
      const userDoctorId = currentUser.doctor_id || currentUser.id;
      const prescriptionDoctorId = prescription?.doctor_id;
      
      if (userDoctorId !== prescriptionDoctorId) {
        return Alert.alert('Permission Denied', 'Only the prescribing doctor can add medicines');
      }
    } else {
      return Alert.alert('Permission Denied', 'Only doctors can add medicines to prescriptions');
    }

    setAddingMedicine(true);
    try {
      console.log('💊 Adding medicine to prescription:', prescriptionId);
      
      await addMedicineToPrescription(prescriptionId, {
        name: form.name.trim(),
        dosage: form.dosage.trim(),
        frequency: form.frequency.trim(),
        duration: form.duration.trim(),
        instructions: form.instructions.trim()
      });
      
      // Reset form
      setForm({
        name: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: ''
      });
      
      // Refresh medicines list
      await fetchMedicines();
      
      Alert.alert('Success', 'Medicine added successfully');
    } catch (err) {
      console.error('❌ Add medicine error:', err);
      
      let errorMessage = 'Failed to add medicine';
      if (err.response?.status === 403) {
        errorMessage = 'Access denied. You do not have permission to add medicines to this prescription.';
      } else if (err.response?.status === 401) {
        errorMessage = 'Authentication failed. Please log in again.';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setAddingMedicine(false);
    }
  };

  const fetchMedicines = async () => {
    try {
      const data = await getPrescriptionMedicines(prescriptionId);
      setMedicines(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('❌ Fetch medicines error:', err);
      // Don't show alert for medicine fetch errors
    }
  };

  const updateForm = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  // SIMPLE TEXT-BASED PRESCRIPTION SHARING
  const sharePrescriptionText = () => {
    const currentDate = new Date().toLocaleDateString();
    
    let prescriptionText = `
MEDICAL PRESCRIPTION
====================

Prescription ID: #${prescription.prescription_id}
Patient: ${prescription.patient_name || 'Not specified'}
Doctor: Dr. ${prescription.doctor_name || 'Not specified'}
Date: ${new Date(prescription.created_at).toLocaleDateString()}

${prescription.notes ? `Doctor's Notes:
${prescription.notes}

` : ''}PRESCRIBED MEDICINES (${medicines.length}):
${medicines.length === 0 ? 'No medicines prescribed' : ''}
${medicines.map((med, index) => `
${index + 1}. ${med.name}
${med.dosage ? `   Dosage: ${med.dosage}` : ''}
${med.frequency ? `   Frequency: ${med.frequency}` : ''}
${med.duration ? `   Duration: ${med.duration}` : ''}
${med.instructions ? `   Instructions: ${med.instructions}` : ''}
`).join('')}

Generated on: ${currentDate}
---
This prescription was generated by HealthCare App
Please consult your doctor for any questions.
    `.trim();

    // Use native sharing
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: 'Medical Prescription',
        text: prescriptionText,
      }).catch(err => console.log('Share cancelled'));
    } else {
      // Fallback: Copy to clipboard or show in alert
      Alert.alert(
        'Prescription Details',
        prescriptionText,
        [
          {
            text: 'Copy Text',
            onPress: () => {
              // If clipboard is available
              if (typeof navigator !== 'undefined' && navigator.clipboard) {
                navigator.clipboard.writeText(prescriptionText);
                Alert.alert('Copied!', 'Prescription text copied to clipboard');
              } else {
                Alert.alert('Text Ready', 'You can manually copy the prescription text from the previous dialog');
              }
            }
          },
          { text: 'Close', style: 'cancel' }
        ]
      );
    }
  };

  // EMAIL PRESCRIPTION FUNCTION
  const emailPrescription = () => {
    const currentDate = new Date().toLocaleDateString();
    
    const emailBody = `Medical Prescription - ${prescription.patient_name}

Prescription ID: ${prescription.prescription_id}
Patient: ${prescription.patient_name || 'Not specified'}
Doctor: Dr. ${prescription.doctor_name || 'Not specified'}
Date: ${new Date(prescription.created_at).toLocaleDateString()}

${prescription.notes ? `Doctor's Notes: ${prescription.notes}

` : ''}Prescribed Medicines (${medicines.length}):
${medicines.map((med, index) => `
${index + 1}. ${med.name}
${med.dosage ? `   Dosage: ${med.dosage}` : ''}
${med.frequency ? `   Frequency: ${med.frequency}` : ''}
${med.duration ? `   Duration: ${med.duration}` : ''}
${med.instructions ? `   Instructions: ${med.instructions}` : ''}
`).join('')}

Generated on: ${currentDate}`;

    const emailUrl = `mailto:?subject=Medical Prescription - ${prescription.patient_name}&body=${encodeURIComponent(emailBody)}`;
    
    Linking.openURL(emailUrl).catch(() => {
      Alert.alert('Error', 'Could not open email app. Please check if you have an email app installed.');
    });
  };

  const renderMedicine = ({ item }) => (
    <View style={styles.medicineCard}>
      <Text style={styles.medicineName}>{item.name}</Text>
      <View style={styles.medicineDetails}>
        {item.dosage && <Text style={styles.medicineDetail}>Dosage: {item.dosage}</Text>}
        {item.frequency && <Text style={styles.medicineDetail}>Frequency: {item.frequency}</Text>}
        {item.duration && <Text style={styles.medicineDetail}>Duration: {item.duration}</Text>}
        {item.instructions && (
          <Text style={styles.medicineInstructions}>Notes: {item.instructions}</Text>
        )}
      </View>
    </View>
  );

  // Show loading state
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading prescription...</Text>
      </View>
    );
  }

  // Show error state if no prescription loaded
  if (!prescription) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorTitle}>Unable to Load Prescription</Text>
        <Text style={styles.errorText}>Please check your connection and try again</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={fetchPrescriptionData}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.goBackButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.goBackButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Check if current user can add medicines (only the prescribing doctor)
  const canAddMedicines = currentUser?.type === 'doctor' && 
    (currentUser.doctor_id === prescription.doctor_id || currentUser.id === prescription.doctor_id);

  // Check if current user is a patient (for sharing options)
  const isPatient = currentUser?.type === 'patient';

  return (
    <ScrollView style={styles.container}>
      {/* Prescription Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Prescription Details</Text>
        <Text style={styles.headerDetail}>
          Patient: {prescription.patient_name || 'Unknown'}
        </Text>
        <Text style={styles.headerDetail}>
          Doctor: {prescription.doctor_name || 'Unknown'}
        </Text>
        <Text style={styles.headerDetail}>
          Created: {new Date(prescription.created_at).toLocaleDateString()}
        </Text>
        {prescription.notes && (
          <View style={styles.notesContainer}>
            <Text style={styles.notesLabel}>Notes:</Text>
            <Text style={styles.notesText}>{prescription.notes}</Text>
          </View>
        )}
      </View>

      {/* SHARING OPTIONS - ONLY FOR PATIENTS */}
      {isPatient && (
        <View style={styles.downloadContainer}>
          <TouchableOpacity 
            onPress={sharePrescriptionText} 
            style={styles.shareButton}
          >
            <Text style={styles.buttonText}>📋 Share Prescription</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={emailPrescription} 
            style={styles.emailButton}
          >
            <Text style={styles.buttonText}>📧 Email Prescription</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Add Medicine Form - Only show for prescribing doctor */}
      {canAddMedicines && (
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Add Medicine</Text>
          
          <TextInput
            placeholder="Medicine name *"
            value={form.name}
            onChangeText={(text) => updateForm('name', text)}
            style={styles.input}
          />
          
          <TextInput
            placeholder="Dosage (e.g., 500mg, 2 tablets)"
            value={form.dosage}
            onChangeText={(text) => updateForm('dosage', text)}
            style={styles.input}
          />
          
          <TextInput
            placeholder="Frequency (e.g., 3 times daily, Before meals)"
            value={form.frequency}
            onChangeText={(text) => updateForm('frequency', text)}
            style={styles.input}
          />
          
          <TextInput
            placeholder="Duration (e.g., 7 days, 2 weeks)"
            value={form.duration}
            onChangeText={(text) => updateForm('duration', text)}
            style={styles.input}
          />
          
          <TextInput
            placeholder="Additional instructions (optional)"
            value={form.instructions}
            onChangeText={(text) => updateForm('instructions', text)}
            multiline
            numberOfLines={3}
            style={[styles.input, styles.textArea]}
            textAlignVertical="top"
          />

          <TouchableOpacity 
            onPress={handleAddMedicine} 
            disabled={addingMedicine || !form.name.trim()}
            style={[styles.addButton, (!form.name.trim() || addingMedicine) && styles.disabledButton]}
          >
            {addingMedicine ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Add Medicine</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Medicines List */}
      <View style={styles.medicinesContainer}>
        <Text style={styles.sectionTitle}>
          Prescribed Medicines ({medicines.length})
        </Text>
        
        {medicines.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No medicines added yet</Text>
          </View>
        ) : (
          <FlatList
            data={medicines}
            keyExtractor={item => String(item.medicine_id)}
            renderItem={renderMedicine}
            scrollEnabled={false}
          />
        )}
      </View>
    </ScrollView>
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
    padding: 40,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
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
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  goBackButton: {
    backgroundColor: '#666',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  goBackButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
    marginBottom: 12,
  },
  headerDetail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  notesContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  // SHARING STYLES
  downloadContainer: {
    margin: 16,
    marginBottom: 8,
    flexDirection: 'row',
    gap: 10,
  },
  shareButton: {
    backgroundColor: '#28a745',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    elevation: 2,
  },
  emailButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    elevation: 2,
  },
  formContainer: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: '#fafafa',
  },
  textArea: {
    minHeight: 80,
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  medicinesContainer: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  medicineCard: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  medicineName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  medicineDetails: {
    gap: 4,
  },
  medicineDetail: {
    fontSize: 14,
    color: '#666',
  },
  medicineInstructions: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 4,
  },
});