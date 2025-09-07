import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import api from "../services/api"; // axios instance

export default function CreateConsultationRequestScreen({ navigation, route }) {
  const [departments, setDepartments] = useState(["Diabetes", "Cardiology", "ENT", "Dermatology"]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [reason, setReason] = useState("");
  const [preferredDateTime, setPreferredDateTime] = useState("");

  useEffect(() => {
    if (selectedDepartment) {
      api.get(`/doctors?specialization=${selectedDepartment}`)
        .then(res => setDoctors(res.data))
        .catch(() => setDoctors([]));
    }
  }, [selectedDepartment]);

  const handleSubmit = async () => {
    if (!selectedDoctor || !reason || !preferredDateTime) {
      return Alert.alert("Error", "Please fill all fields");
    }
    try {
      // Assume patient_id comes from auth
      const patient_id = route.params?.patient_id;
      const res = await api.post("/consultants", {
        patient_id,
        doctor_id: selectedDoctor,
        reason,
        preferred_datetime: preferredDateTime,
      });
      Alert.alert("Success", "Request submitted!");
      navigation.navigate("PatientConsultations");
    } catch (err) {
      Alert.alert("Error", err.response?.data?.error || "Failed to submit");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Book Appointment</Text>

      <Text style={styles.label}>Department *</Text>
      <Picker selectedValue={selectedDepartment} onValueChange={setSelectedDepartment}>
        <Picker.Item label="Select department" value="" />
        {departments.map((dep, i) => (
          <Picker.Item key={i} label={dep} value={dep} />
        ))}
      </Picker>

      <Text style={styles.label}>Doctor *</Text>
      <Picker selectedValue={selectedDoctor} onValueChange={setSelectedDoctor}>
        <Picker.Item label="No doctors available" value="" />
        {doctors.map((doc) => (
          <Picker.Item key={doc.doctor_id} label={doc.name} value={doc.doctor_id} />
        ))}
      </Picker>

      <Text style={styles.label}>Reason for Visit</Text>
      <TextInput
        style={styles.input}
        placeholder="Describe your symptoms"
        value={reason}
        onChangeText={setReason}
      />

      <Text style={styles.label}>Preferred Date/Time</Text>
      <TextInput
        style={styles.input}
        placeholder="YYYY-MM-DD HH:mm"
        value={preferredDateTime}
        onChangeText={setPreferredDateTime}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Book Appointment</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  label: { marginTop: 10, fontWeight: "600" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginTop: 5 },
  button: { backgroundColor: "#2e7d32", padding: 15, borderRadius: 8, marginTop: 20 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold" }
});
