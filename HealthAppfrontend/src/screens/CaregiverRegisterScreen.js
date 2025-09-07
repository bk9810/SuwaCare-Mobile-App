import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getSession } from '../services/session';
import { registerCaregiver } from '../services/api';

const CaregiverRegisterScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    relation: ''
  });

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleRegister = async () => {
    try {
      const { token, patient } = await getSession();
      if (!token || !patient?.patient_id) {
        Alert.alert("Error", "No session found");
        return;
      }

      await registerCaregiver(patient.patient_id, token, form);
      Alert.alert("Success", "Caregiver registered successfully");
      navigation.goBack();
    } catch (err) {
      console.error("Register caregiver error:", err.response?.data || err.message);
      Alert.alert("Error", "Failed to register caregiver");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register Caregiver</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={form.name}
        onChangeText={(t) => handleChange("name", t)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={form.email}
        onChangeText={(t) => handleChange("email", t)}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={form.phone}
        onChangeText={(t) => handleChange("phone", t)}
      />
      <TextInput
        style={styles.input}
        placeholder="Relation (e.g. Father, Sister)"
        value={form.relation}
        onChangeText={(t) => handleChange("relation", t)}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};



const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1, borderColor: "#ccc", borderRadius: 8,
    padding: 10, marginBottom: 15
  },
  button: {
    backgroundColor: "#007bff", padding: 15,
    borderRadius: 8, alignItems: "center"
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" }
});
export default CaregiverRegisterScreen;