import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function ManageInfoScreen({ navigation }) {  // <-- add navigation here
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Medical Information</Text>

      
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('DoctorAppointment')} 
      >
        <Text style={styles.buttonText}>Manage Appointment</Text>
      </TouchableOpacity>

    
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('DoctorConsultationScreen')}
      >
        <Text style={styles.buttonText}>Manage Consultations</Text>
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
