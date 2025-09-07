import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import api from "../services/api";

export default function DoctorConsultationsScreen({ navigation, route }) {
  const [requests, setRequests] = useState([]);
  const doctor_id = route.params?.doctor_id;

  useEffect(() => {
    api.get(`/consultants/doctor/${doctor_id}`)
      .then(res => setRequests(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Consultation Requests</Text>
      <FlatList
        data={requests}
        keyExtractor={(item) => item.consultant_id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("ConsultationDetails", { consultation: item })}
          >
            <Text>Patient ID: {item.patient_id}</Text>
            <Text>Reason: {item.reason}</Text>
            <Text>Status: {item.status}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  card: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 15, marginBottom: 10 }
});
