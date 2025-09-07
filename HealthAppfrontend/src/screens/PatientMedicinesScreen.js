// PatientMedicinesScreen
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Image, TouchableOpacity, Linking } from "react-native";

export default function PatientMedicinesScreen({ route }) {
  const patientId = route?.params?.patientId;
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  console.log("Patient ID:", patientId); // check if valid
  if (!patientId) {
    setLoading(false);
    return;
  }

  axios
    .get(`http:// 10.195.21.165:5000/api/medicines/patient/${patientId}`)
    .then((res) => {
      console.log("Medicines fetched:", res.data); // confirm data
      setMedicines(res.data);
    })
    .catch((err) => console.error("Error fetching medicines:", err))
    .finally(() => setLoading(false));
}, [patientId]);

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  const handleDownload = () => {
    Linking.openURL(`http:// 10.195.21.165:5000/api/medicines/patient/${patientId}/download`);
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={medicines}
        keyExtractor={(item) => item.medicine_id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>
              {item.medicine_name} ({item.strength})
            </Text>
            <Text>{item.dosage}, {item.frequency}, for {item.duration}</Text>
            <Text>Doctor: {item.doctor_name}</Text>
            <Text>Status: {item.status}</Text>
          </View>
        )}
      />

      <TouchableOpacity style={styles.downloadBtn} onPress={handleDownload}>
        <Text style={styles.downloadText}>Download Prescription PDF</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 15, borderBottomWidth: 1, borderColor: "#ddd" },
  name: { fontWeight: "bold", fontSize: 16 },
  downloadBtn: { backgroundColor: "green", padding: 15, alignItems: "center" },
  downloadText: { color: "white", fontWeight: "bold" }
});
