// ===== FIXED ConsultationDetailsScreen.js =====
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { acceptConsultation, rejectConsultation } from "../services/api";

export default function ConsultationDetailsScreen({ route, navigation }) {
  const { consultation } = route.params || {};
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(false);

  if (!consultation) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Consultation data not found</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const validateDateTime = (datetime) => {
    const regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;
    return regex.test(datetime.trim());
  };

  const handleAccept = async () => {
    if (!startTime.trim() || !endTime.trim()) {
      return Alert.alert("Error", "Please enter both start and end times");
    }

    if (!validateDateTime(startTime) || !validateDateTime(endTime)) {
      return Alert.alert("Error", "Please enter times in format: YYYY-MM-DD HH:mm");
    }

    // Check if end time is after start time
    const start = new Date(startTime.replace(' ', 'T'));
    const end = new Date(endTime.replace(' ', 'T'));
    
    if (end <= start) {
      return Alert.alert("Error", "End time must be after start time");
    }

    try {
      setLoading(true);
      const meetingData = {
        start_time: startTime.trim(),
        end_time: endTime.trim(),
        summary: "Medical Consultation",
        description: consultation.reason,
      };

      await acceptConsultation(consultation.consultant_id, meetingData);
      
      Alert.alert(
        "Success", 
        "Consultation accepted and meeting created!",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      console.error("Accept consultation error:", error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          error.message || 
                          "Failed to accept consultation";
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    Alert.alert(
      "Confirm Rejection",
      "Are you sure you want to reject this consultation?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reject",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              await rejectConsultation(consultation.consultant_id);
              
              Alert.alert(
                "Success",
                "Consultation rejected successfully",
                [
                  {
                    text: "OK",
                    onPress: () => navigation.goBack()
                  }
                ]
              );
            } catch (error) {
              console.error("Reject consultation error:", error);
              Alert.alert("Error", "Failed to reject consultation");
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Consultation Details</Text>
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>Patient ID:</Text>
        <Text style={styles.infoValue}>{consultation.patient_id}</Text>
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>Reason:</Text>
        <Text style={styles.infoValue}>{consultation.reason}</Text>
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>Status:</Text>
        <Text style={[styles.infoValue, styles.statusText]}>{consultation.status}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>Requested Time:</Text>
        <Text style={styles.infoValue}>{consultation.preferred_datetime}</Text>
      </View>

      {consultation.status === 'PENDING' && (
        <>
          <Text style={styles.sectionTitle}>Schedule Meeting</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Start Time (YYYY-MM-DD HH:mm)"
            value={startTime}
            onChangeText={setStartTime}
            editable={!loading}
          />
          
          <TextInput
            style={styles.input}
            placeholder="End Time (YYYY-MM-DD HH:mm)"
            value={endTime}
            onChangeText={setEndTime}
            editable={!loading}
          />

          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleAccept}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Processing..." : "Accept & Create Meeting"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.rejectButton, loading && styles.buttonDisabled]} 
            onPress={handleReject}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Reject</Text>
          </TouchableOpacity>
        </>
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
  title: { 
    fontSize: 22, 
    fontWeight: "bold", 
    marginBottom: 20,
    textAlign: "center"
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
    color: "#333"
  },
  infoContainer: {
    flexDirection: "row",
    marginVertical: 8,
    paddingVertical: 5
  },
  infoLabel: {
    fontWeight: "600",
    width: 100,
    color: "#666"
  },
  infoValue: {
    flex: 1,
    color: "#333"
  },
  statusText: {
    fontWeight: "600",
    color: "#2e7d32"
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginBottom: 20
  },
  input: { 
    borderWidth: 1, 
    borderColor: "#ccc", 
    borderRadius: 8, 
    padding: 12, 
    marginVertical: 8,
    fontSize: 16
  },
  button: { 
    backgroundColor: "#2e7d32", 
    padding: 15, 
    borderRadius: 8, 
    marginTop: 15 
  },
  rejectButton: {
    backgroundColor: "#d32f2f"
  },
  buttonDisabled: {
    backgroundColor: "#ccc"
  },
  buttonText: { 
    color: "#fff", 
    textAlign: "center", 
    fontWeight: "bold",
    fontSize: 16
  }
});
