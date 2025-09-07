// Fixed src/screens/MyAppointmentsScreen.jsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Button,
  RefreshControl,

} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient"; // gradient
import { BlurView } from "expo-blur"; // glassmorphism
import { getMyAppointments } from "../services/api";

export default function MyAppointmentsScreen({ patientId: propPatientId }) {
  const [patientId, setPatientId] = useState(propPatientId);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load patientId
  useEffect(() => {
    const initializePatientId = async () => {
      try {
        let finalPatientId = propPatientId;

        if (!finalPatientId) {
          const userData = await AsyncStorage.getItem("userData");
          if (userData) {
            const parsed = JSON.parse(userData);
            finalPatientId =
              parsed.patient_id || parsed.id || parsed.patientId;
          }
        }

        if (finalPatientId) {
          setPatientId(finalPatientId);
          setError("");
        } else {
          setError("Patient ID not found. Please log in again.");
        }
      } catch (error) {
        setError("Error retrieving patient information.");
      }
    };

    initializePatientId();
  }, [propPatientId]);

  const fetchAppointments = async () => {
    if (!patientId) return;

    setLoading(true);
    setError("");

    try {
      const data = await getMyAppointments(patientId);
      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Please log in again.");
      } else if (err.response?.status === 404) {
        setError("No appointments found.");
        setAppointments([]);
      } else {
        setError("Failed to fetch appointments. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (patientId && !error) {
      fetchAppointments();
    }
  }, [patientId]);

  const renderItem = ({ item }) => (
    <BlurView intensity={80} tint="light" style={styles.card}>
      <Text style={styles.bold}>
        Doctor: {item.doctor_name || "Unknown Doctor"}
      </Text>
      <Text style={styles.detail}>Department: {item.department}</Text>
      <Text style={styles.detail}>
        Reason: {item.reason || "Not specified"}
      </Text>
      <Text style={styles.detail}>
        Scheduled At:{" "}
        {item.scheduled_at
          ? new Date(item.scheduled_at).toLocaleString()
          : "Not specified"}
      </Text>
      <Text
        style={[
          styles.status,
          item.status === "PENDING" && styles.pendingStatus,
          item.status === "ACCEPTED" && styles.acceptedStatus,
          item.status === "REJECTED" && styles.rejectedStatus,
        ]}
      >
        Status: {item.status}
      </Text>
      <Text style={styles.appointmentId}>ID: {item.appointment_id}</Text>
    </BlurView>
  );

  if (error) {
    return (
      <LinearGradient colors={["#667eea", "#764ba2"]} >
        <SafeAreaView style={styles.container}>
      <Text style={styles.title}>My Appointments</Text>
     
    </SafeAreaView>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button
            title="Retry"
            onPress={() => {
              setError("");
              fetchAppointments();
            }}
          />
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.container}>

      <Text style={styles.title}>My Appointments</Text>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Loading appointments...</Text>
        </View>
      ) : appointments.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No appointments found</Text>
          <Text style={styles.emptySubtext}>
            Book your first appointment to see it here
          </Text>
          <Button title="Refresh" onPress={fetchAppointments} color="#2196F3" />
        </View>
      ) : (
        <FlatList
          data={appointments}
          keyExtractor={(item) => item.appointment_id.toString()}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={fetchAppointments}
              colors={["#2196F3"]}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20, // 👈 මෙතනින් control කරන්න
    marginBottom: 25,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  bold: {
    fontWeight: "900",
    fontSize: 22,
    marginBottom: 10,
    color: "#2d3748",
  },
  detail: {
    fontSize: 16,
    marginBottom: 8,
    color: "#4a5568",
  },
  status: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 15,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    textAlign: "center",
    alignSelf: "flex-start",
  },
  pendingStatus: {
    backgroundColor: "#ff9a56",
    color: "#fff",
  },
  acceptedStatus: {
    backgroundColor: "#56cc9d",
    color: "#fff",
  },
  rejectedStatus: {
    backgroundColor: "#ff5e5b",
    color: "#fff",
  },
  appointmentId: {
    fontSize: 14,
    color: "#718096",
    marginTop: 12,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 20,
    fontSize: 20,
    color: "#fff",
    fontWeight: "700",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  emptyText: {
    fontSize: 28,
    color: "#fff",
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "800",
  },
  emptySubtext: {
    fontSize: 18,
    color: "rgba(255,255,255,0.85)",
    marginBottom: 20,
    textAlign: "center",
  },
  errorContainer: {
    backgroundColor: "rgba(254, 242, 242, 0.95)",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 30,
  },
  errorText: {
    color: "#e53e3e",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "700",
  },
});
