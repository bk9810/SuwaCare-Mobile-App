import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from "react-native";
import axios from "axios";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function AddMedicineScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  // IDs & Patient Name passed via navigation params
  const { doctorId, patientId, chronicId, patientName } = route.params || {};

  const [medicineName, setMedicineName] = useState("");
  const [form, setForm] = useState("");
  const [strength, setStrength] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [duration, setDuration] = useState("");
  const [instructions, setInstructions] = useState("");

  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://  10.195.21.165:5000/api/medicines", {
        doctor_id: doctorId,
        patient_id: patientId,
        chronic_disease_id: chronicId,
        medicine_name: medicineName,
        form,
        strength,
        dosage,
        frequency,
        duration,
        instructions
      });

      Alert.alert("✅ Success", `Prescription added for ${patientName || "Patient ID: " + patientId}`);
      navigation.navigate("PatientMedicines", { patientId });
    } catch (err) {
      console.error(err);
      Alert.alert("❌ Error", err.response?.data?.error || "Failed to add medicine");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Show patient name / ID clearly for doctor confirmation */}
      <Text style={styles.title}>
        Add Prescription for {patientName || `Patient ID: ${patientId}`}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Medicine Name"
        value={medicineName}
        onChangeText={setMedicineName}
      />
      <TextInput
        style={styles.input}
        placeholder="Form (Tablet/Syrup)"
        value={form}
        onChangeText={setForm}
      />
      <TextInput
        style={styles.input}
        placeholder="Strength (500mg)"
        value={strength}
        onChangeText={setStrength}
      />
      <TextInput
        style={styles.input}
        placeholder="Dosage (1 tablet)"
        value={dosage}
        onChangeText={setDosage}
      />
      <TextInput
        style={styles.input}
        placeholder="Frequency (twice a day)"
        value={frequency}
        onChangeText={setFrequency}
      />
      <TextInput
        style={styles.input}
        placeholder="Duration (7 days)"
        value={duration}
        onChangeText={setDuration}
      />
      <TextInput
        style={styles.input}
        placeholder="Instructions"
        value={instructions}
        onChangeText={setInstructions}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>💊 Save Prescription</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flexGrow: 1, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20, color: "#333" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginBottom: 10 },
  button: { backgroundColor: "blue", padding: 15, borderRadius: 5, alignItems: "center" },
  buttonText: { color: "white", fontWeight: "bold" }
});
