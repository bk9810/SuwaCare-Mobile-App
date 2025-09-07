import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function ManageInfoScreen({ navigation }) {  // <-- add navigation here
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Medical Information</Text>

      {/* Doctor Appointment */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('DoctorAppointment')} // ✅ works now
      >
        <Text style={styles.buttonText}>Doctor Appointment (Online/Offline)</Text>
      </TouchableOpacity>

      {/* Medical Consultations */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('MedicalConsultations')}
      >
        <Text style={styles.buttonText}>Medical Consultations</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
    textAlign: 'center',
  },
  button: {
    width: '90%',
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 12,
    marginVertical: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
