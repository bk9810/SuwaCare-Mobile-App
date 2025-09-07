// ===== FIXED PatientConsultationsScreen.js =====
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl, Alert, Linking } from "react-native";
import { getPatientConsultations } from "../services/api";

export default function PatientConsultationsScreen({ route }) {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const patient_id = route.params?.patient_id;

  useEffect(() => {
    if (patient_id) {
      fetchConsultations();
    } else {
      Alert.alert("Error", "Patient ID not found");
      setLoading(false);
    }
  }, [patient_id]);

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      const response = await getPatientConsultations(patient_id);
      setConsultations(response || []);
    } catch (error) {
      console.error("Fetch consultations error:", error);
      Alert.alert("Error", "Failed to fetch consultations");
      setConsultations([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchConsultations();
  };

  const handleJoinMeeting = (meetingLink) => {
    if (meetingLink) {
      Linking.openURL(meetingLink).catch(() => {
        Alert.alert("Error", "Unable to open meeting link");
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return '#ff9800';
      case 'ACCEPTED': return '#4caf50';
      case 'REJECTED': return '#f44336';
      default: return '#666';
    }
  };

  const renderConsultationItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.doctorId}>Doctor ID: {item.doctor_id}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      
      <Text style={styles.reason} numberOfLines={2}>
        Reason: {item.reason}
      </Text>
      
      <Text style={styles.datetime}>
        Requested Time: {item.preferred_datetime}
      </Text>
      
      {item.created_at && (
        <Text style={styles.createdAt}>
          Requested on: {new Date(item.created_at).toLocaleDateString()}
        </Text>
      )}
      
      {item.meeting_link && item.status === 'ACCEPTED' && (
        <TouchableOpacity 
          style={styles.meetingButton}
          onPress={() => handleJoinMeeting(item.meeting_link)}
        >
          <Text style={styles.meetingButtonText}>Join Meeting</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text>Loading your consultations...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Consultations</Text>
      
      {consultations.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>No consultations found</Text>
        </View>
      ) : (
        <FlatList
          data={consultations}
          keyExtractor={(item) => item.consultant_id.toString()}
          renderItem={renderConsultationItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: "#fff" 
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: { 
    fontSize: 22, 
    fontWeight: "bold", 
    marginBottom: 20,
    textAlign: "center"
  },
  card: { 
    borderWidth: 1, 
    borderColor: "#ddd", 
    borderRadius: 10, 
    padding: 15, 
    marginBottom: 12,
    backgroundColor: "#fafafa"
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8
  },
  doctorId: {
    fontWeight: "600",
    fontSize: 16,
    color: "#333"
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600"
  },
  reason: {
    marginVertical: 5,
    fontSize: 14,
    color: "#555"
  },
  datetime: {
    fontSize: 14,
    color: "#666",
    marginTop: 5
  },
  createdAt: {
    fontSize: 12,
    color: "#888",
    marginTop: 5
  },
  meetingButton: {
    backgroundColor: "#2196f3",
    padding: 10,
    borderRadius: 6,
    marginTop: 10,
    alignItems: "center"
  },
  meetingButtonText: {
    color: "white",
    fontWeight: "600"
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center"
  }
});