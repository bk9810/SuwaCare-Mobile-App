import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getCaregivers } from '../services/api';
import { getSession } from '../services/session';

const CaregiverListScreen = ({ navigation }) => {
  const [caregivers, setCaregivers] = useState([]);

  useEffect(() => {
    const fetchCaregivers = async () => {
      try {
        const { token, patient } = await getSession();
        if (!token || !patient?.patient_id) {
          Alert.alert("Error", "No session found");
          return;
        }
        const data = await getCaregivers(patient.patient_id, token);
        setCaregivers(data);
      } catch (err) {
        console.error("Fetch caregivers error:", err.response?.data || err.message);
        Alert.alert("Error", "Failed to load caregivers");
      }
    };
    fetchCaregivers();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Caregivers</Text>
      <FlatList
        data={caregivers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text>Email: {item.email}</Text>
            <Text>Phone: {item.phone}</Text>
            <Text>Relation: {item.relation}</Text>

            <TouchableOpacity
              style={styles.manageBtn}
              onPress={() => navigation.navigate("CaregiverManage", { caregiver: item })}
            >
              <Text style={styles.manageText}>Manage</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};



const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd"
  },
  name: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  manageBtn: {
    marginTop: 10, backgroundColor: "#28a745",
    padding: 10, borderRadius: 8, alignItems: "center"
  },
  manageText: { color: "#fff", fontWeight: "bold" }
});
export default CaregiverListScreen;
