// MedicalInfoScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function MedicalInfoScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Medical Information</Text>

      {/* Doctor Appointment */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('BookAppointment')}
      >
        <Text style={styles.buttonText}>Create Booking</Text>
      </TouchableOpacity>

      {/* Medical Consultations */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('CreateConsultationRequestScreen')}
      >
        <Text style={styles.buttonText}>Medical Consultations</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: '#f8fffe',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 40,
    color: '#2c5aa0',
    textAlign: 'center',
    letterSpacing: 0.8,
    textDecorationLine: 'underline',
    textShadowColor: 'rgba(44, 90, 160, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
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
  buttonPressed: {
    transform: [{ scale: 0.98 }],
    shadowOpacity: 0.2,
    elevation: 4,
  },
  medicalIcon: {
    width: 100,
    height: 100,
    backgroundColor: '#e6fffa',
    borderRadius: 50,
    marginBottom: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2c5aa0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  subtitle: {
    fontSize: 16,
    color: '#4a6741',
    textAlign: 'center',
    marginBottom: 25,
    fontWeight: '500',
    letterSpacing: 0.3,
    lineHeight: 22,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  alternativeButton: {
    width: '95%',
    backgroundColor: '#4299e1',
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderRadius: 15,
    marginVertical: 12,
    alignItems: 'center',
    shadowColor: '#4299e1',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 8,
    elevation: 8,
    borderLeftWidth: 6,
    borderLeftColor: '#3182ce',
  },
});