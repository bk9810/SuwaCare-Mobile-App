import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { updateCaregiver } from '../services/api';
import { getSession } from '../services/session';

const CaregiverManageScreen = ({ route, navigation }) => {
  const { caregiver } = route.params;
  const [form, setForm] = useState({
    name: caregiver.name,
    email: caregiver.email,
    phone: caregiver.phone,
    relation: caregiver.relation
  });

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleUpdate = async () => {
    try {
      const { token } = await getSession();
      if (!token) {
        Alert.alert("Error", "No session found");
        return;
      }
      await updateCaregiver(caregiver.id, token, form);
      Alert.alert("Success", "Caregiver updated successfully");
      navigation.goBack();
    } catch (err) {
      console.error("Update caregiver error:", err.response?.data || err.message);
      Alert.alert("Error", "Failed to update caregiver");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Caregiver</Text>

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
        placeholder="Relation"
        value={form.relation}
        onChangeText={(t) => handleChange("relation", t)}
      />

      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Update</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CaregiverManageScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1, borderColor: "#ccc", borderRadius: 8,
    padding: 10, marginBottom: 15
  },
  button: {
    backgroundColor: "#28a745", padding: 15,
    borderRadius: 8, alignItems: "center"
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" }
});
