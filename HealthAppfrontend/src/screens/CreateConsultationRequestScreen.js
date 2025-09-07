// SOLUTION 1: Enhanced CreateConsultationRequestScreen with debugging
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createConsultation, getDoctors } from "../services/api";

export default function CreateConsultationRequestScreen({ navigation, route }) {
  const [departments, setDepartments] = useState(["Diabetes", "Cardiology", "ENT", "Dermatology"]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [reason, setReason] = useState("");
  const [preferredDateTime, setPreferredDateTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [patientId, setPatientId] = useState(null);

  // Debug and get patient ID
  useEffect(() => {
    debugRouteAndGetPatientId();
  }, []);

  const debugRouteAndGetPatientId = async () => {
    try {
      console.log('🔍 Route Debug:', {
        routeParams: route.params,
        hasParams: !!route.params,
        patientIdFromRoute: route.params?.patient_id
      });

      // Try to get patient_id from route first
      let patient_id = route.params?.patient_id;
      
      // If not in route, try to get from AsyncStorage
      if (!patient_id) {
        console.log('⚠️ No patient_id in route, checking AsyncStorage...');
        const userData = await AsyncStorage.getItem('userData');
        
        if (userData) {
          const parsedData = JSON.parse(userData);
          patient_id = parsedData.patient_id;
          console.log('📱 Found patient_id in AsyncStorage:', patient_id);
        }
      }

      if (patient_id) {
        setPatientId(patient_id);
        console.log('✅ Patient ID set:', patient_id);
      } else {
        console.error('❌ No patient_id found anywhere');
        Alert.alert(
          "Authentication Error",
          "Patient ID not found. Please log in again.",
          [
            {
              text: "Go to Login",
              onPress: () => navigation.navigate("Login") // Adjust to your login screen name
            }
          ]
        );
      }
    } catch (error) {
      console.error('❌ Error getting patient ID:', error);
      Alert.alert("Error", "Failed to get user information. Please try again.");
    }
  };

  // Fetch doctors when department changes
  useEffect(() => {
    if (selectedDepartment) {
      fetchDoctors();
    } else {
      setDoctors([]);
      setSelectedDoctor("");
    }
  }, [selectedDepartment]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await getDoctors(selectedDepartment);
      setDoctors(response || []);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      Alert.alert("Error", "Failed to fetch doctors. Please try again.");
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    // Check if patient ID is available
    if (!patientId) {
      return Alert.alert(
        "Error", 
        "Patient ID not found. Please login again.",
        [
          {
            text: "Go to Login",
            onPress: () => navigation.navigate("Login")
          }
        ]
      );
    }

    // Validation
    if (!selectedDoctor || !reason.trim() || !preferredDateTime.trim()) {
      return Alert.alert("Error", "Please fill all required fields");
    }

    // Basic datetime format validation
    const datetimeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;
    if (!datetimeRegex.test(preferredDateTime.trim())) {
      return Alert.alert("Error", "Please enter date/time in format: YYYY-MM-DD HH:mm");
    }

    try {
      setLoading(true);

      const consultationData = {
        patient_id: patientId, // Use the state variable
        doctor_id: selectedDoctor,
        reason: reason.trim(),
        preferred_datetime: preferredDateTime.trim(),
      };

      console.log('📝 Submitting consultation:', consultationData);

      await createConsultation(consultationData);
      
      Alert.alert(
        "Success", 
        "Consultation request submitted successfully!",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("PatientConsultations", { patient_id: patientId })
          }
        ]
      );
    } catch (error) {
      console.error("Submit consultation error:", error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          error.message || 
                          "Failed to submit consultation request";
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while getting patient ID
  if (patientId === null) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text>Loading user information...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Book Consultation</Text>
      <Text style={styles.subtitle}>Patient ID: {patientId}</Text>

      <Text style={styles.label}>Department *</Text>
      <View style={styles.pickerContainer}>
        <Picker 
          selectedValue={selectedDepartment} 
          onValueChange={setSelectedDepartment}
          enabled={!loading}
        >
          <Picker.Item label="Select department" value="" />
          {departments.map((dep, i) => (
            <Picker.Item key={i} label={dep} value={dep} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Doctor *</Text>
      <View style={styles.pickerContainer}>
        <Picker 
          selectedValue={selectedDoctor} 
          onValueChange={setSelectedDoctor}
          enabled={!loading && doctors.length > 0}
        >
          <Picker.Item 
            label={loading ? "Loading doctors..." : (doctors.length > 0 ? "Select a doctor" : "No doctors available")} 
            value="" 
          />
          {doctors.map((doc) => (
            <Picker.Item 
              key={doc.doctor_id} 
              label={`Dr. ${doc.name} - ${doc.specialization}`} 
              value={doc.doctor_id} 
            />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Reason for Visit *</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Describe your symptoms or reason for consultation"
        value={reason}
        onChangeText={setReason}
        multiline
        numberOfLines={3}
      />

      <Text style={styles.label}>Preferred Date/Time *</Text>
      <TextInput
        style={styles.input}
        placeholder="YYYY-MM-DD HH:mm (e.g., 2024-12-01 14:30)"
        value={preferredDateTime}
        onChangeText={setPreferredDateTime}
      />

      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Submitting..." : "Book Consultation"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: "#fff" 
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: { 
    fontSize: 22, 
    fontWeight: "bold", 
    marginBottom: 10,
    textAlign: "center"
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20
  },
  label: { 
    marginTop: 15, 
    fontWeight: "600",
    fontSize: 16,
    color: "#333"
  },
  input: { 
    borderWidth: 1, 
    borderColor: "#ccc", 
    borderRadius: 8, 
    padding: 12, 
    marginTop: 8,
    fontSize: 16
  },
  textArea: {
    height: 80,
    textAlignVertical: "top"
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginTop: 8,
  },
  button: { 
    backgroundColor: "#2e7d32", 
    padding: 15, 
    borderRadius: 8, 
    marginTop: 25 
  },
  buttonDisabled: {
    backgroundColor: "#ccc"
  },
  buttonText: { 
    color: "#fff", 
    textAlign: "center", 
    fontWeight: "bold",
    fontSize: 16
  }
});

// SOLUTION 2: Navigation Helper Functions
// Add this to your navigation components or utils

export const navigateToConsultation = (navigation, patientData) => {
  console.log('🧭 Navigating to consultation with patient data:', patientData);
  
  navigation.navigate("CreateConsultationRequest", {
    patient_id: patientData.patient_id,
    patient_name: patientData.name,
    patient_email: patientData.email
  });
};

// SOLUTION 3: Check your login flow - make sure you're navigating correctly
// In your login success handler, do this:

export const handleLoginSuccess = async (navigation, loginResponse) => {
  try {
    // Save user data
    if (loginResponse.patient) {
      const patientData = {
        patient_id: loginResponse.patient.patient_id,
        name: loginResponse.patient.name,
        email: loginResponse.patient.email,
        type: 'patient'
      };
      
      await AsyncStorage.setItem('userData', JSON.stringify(patientData));
      console.log('✅ Patient data saved:', patientData);
      
      // Navigate with patient_id
      navigation.navigate("PatientConsultationsScreen", { 
        patient_id: loginResponse.patient.patient_id 
      });
    }
  } catch (error) {
    console.error('❌ Login success handler error:', error);
  }
};

// SOLUTION 4: Add this debugging component to check what's in AsyncStorage
export const DebugUserData = () => {
  const checkUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      const token = await AsyncStorage.getItem('token');
      
      console.log('🔍 Debug User Data:', {
        hasUserData: !!userData,
        hasToken: !!token,
        userData: userData ? JSON.parse(userData) : null,
        tokenPreview: token ? `${token.substring(0, 20)}...` : null
      });
      
      Alert.alert(
        "Debug Info",
        `User Data: ${userData}\nHas Token: ${!!token}`
      );
    } catch (error) {
      console.error('❌ Debug error:', error);
      Alert.alert("Error", "Failed to get debug info");
    }
  };

  return (
    <TouchableOpacity style={{ padding: 20 }} onPress={checkUserData}>
      <Text>Debug User Data</Text>
    </TouchableOpacity>
  );
};