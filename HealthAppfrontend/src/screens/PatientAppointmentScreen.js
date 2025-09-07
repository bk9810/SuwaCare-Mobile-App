import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from "react-native";
import axios from "axios";
import { useRoute } from "@react-navigation/native";

export default function PatientMedicinesScreen() {
  const route = useRoute();
  const { patientId } = route.params || {};

  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const response = await axios.get(`http://  10.195.21.165:5000/api/medicines/patient/${patientId}`);

      if (response.data.error) {
        // if backend says no doctor assigned
        setError(response.data.error);
        setMedicines([]);
      } else {
        setMedicines(response.data);
        setError("");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load medicines");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>⚠️ {error}</Text>
      </View>
    );
  }

  if (medicines.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.noData}>No prescriptions found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Prescriptions</Text>
      <FlatList
        data={medicines}
        keyExtractor={(item) => item.medicine_id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.medicineName}>{item.medicine_name}</Text>
            <Text>Form: {item.form}</Text>
            <Text>Strength: {item.strength}</Text>
            <Text>Dosage: {item.dosage}</Text>
            <Text>Frequency: {item.frequency}</Text>
            <Text>Duration: {item.duration}</Text>
            <Text>Instructions: {item.instructions}</Text>
            <Text style={styles.doctor}>👨‍⚕️ Prescribed by: Dr. {item.doctor_name}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 15, color: "#333" },
  card: { padding: 15, borderWidth: 1, borderColor: "#ddd", borderRadius: 8, marginBottom: 10, backgroundColor: "#f9f9f9" },
  medicineName: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  doctor: { marginTop: 8, fontStyle: "italic", color: "#555" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { fontSize: 16, color: "red", textAlign: "center" },
  noData: { fontSize: 16, color: "#777" }
});
