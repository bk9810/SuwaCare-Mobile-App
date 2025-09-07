import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import api from "../services/api";

export default function ConsultationDetailsScreen({ route, navigation }) {
  const { consultation } = route.params;
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleAccept = async () => {
    try {
      const res = await api.put(`/consultants/${consultation.consultant_id}/accept`, {
        start_time: startTime,
        end_time: endTime,
        summary: "Medical Consultation",
        description: consultation.reason,
      });
      Alert.alert("Accepted", "Meeting created!");
      navigation.goBack();
    } catch (err) {
      Alert.alert("Error", err.response?.data?.error || "Failed to accept");
    }
  };

  const handleReject = async () => {
    try {
      await api.put(`/consultants/${consultation.consultant_id}/reject`);
      Alert.alert("Rejected", "Consultation rejected.");
      navigation.goBack();
    } catch (err) {
      Alert.alert("Error", "Failed to reject");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Consultation Details</Text>
      <Text>Patient ID: {consultation.patient_id}</Text>
      <Text>Reason: {consultation.reason}</Text>
      <Text>Status: {consultation.status}</Text>

      <TextInput
        style={styles.input}
        placeholder="Start Time (YYYY-MM-DD HH:mm)"
        value={startTime}
        onChangeText={setStartTime}
      />
      <TextInput
        style={styles.input}
        placeholder="End Time (YYYY-MM-DD HH:mm)"
        value={endTime}
        onChangeText={setEndTime}
      />

      <TouchableOpacity style={styles.button} onPress={handleAccept}>
        <Text style={styles.buttonText}>Accept & Create Meeting</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: "red" }]} onPress={handleReject}>
        <Text style={styles.buttonText}>Reject</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginVertical: 10 },
  button: { backgroundColor: "#2e7d32", padding: 15, borderRadius: 8, marginTop: 10 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold" }
});
