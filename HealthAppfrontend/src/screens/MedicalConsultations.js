// src/screens/PrescriptionScreen.js
import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

export default function DoctorAppointment() {
  // Example placeholder data
  const prescriptions = [
    { id: '1', name: 'Paracetamol', dosage: '500mg', frequency: 'Twice a day' },
    { id: '2', name: 'Amoxicillin', dosage: '250mg', frequency: 'Three times a day' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Prescription Management</Text>
      <FlatList
        data={prescriptions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.info}>Dosage: {item.dosage}</Text>
            <Text style={styles.info}>Frequency: {item.frequency}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.info}>No prescriptions found.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f0f8ff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, alignSelf: 'center' },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 5 },
  name: { fontSize: 18, fontWeight: '600', marginBottom: 5 },
  info: { fontSize: 16, color: '#555' },
});
