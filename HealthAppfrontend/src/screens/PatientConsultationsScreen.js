import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import api from "../services/api";

export default function PatientConsultationsScreen({ route }) {
  const [consultations, setConsultations] = useState([]);
  const patient_id = route.params?.patient_id;

  useEffect(() => {
    api.get(`/consultants/patient/${patient_id}`)
      .then(res => setConsultations(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Consultations</Text>
      <FlatList
        data={consultations}
        keyExtractor={(item) => item.consultant_id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>Doctor ID: {item.doctor_id}</Text>
            <Text>Reason: {item.reason}</Text>
            <Text>Status: {item.status}</Text>
            {item.meeting_link && (
              <TouchableOpacity onPress={() => {}}>
                <Text style={styles.link}>Join Meeting</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  card: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 15, marginBottom: 10 },
  link: { color: "blue", marginTop: 5 }
});
