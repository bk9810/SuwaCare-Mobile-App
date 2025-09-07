// FIXED DoctorConsultationsScreen.js with ID resolution
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl, Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDoctorConsultations } from "../services/api";

export default function DoctorConsultationsScreen({ navigation, route }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [doctorId, setDoctorId] = useState(null);

  // Debug and get doctor ID
  useEffect(() => {
    debugRouteAndGetDoctorId();
  }, []);

  const debugRouteAndGetDoctorId = async () => {
    try {
      console.log('🔍 Doctor Route Debug:', {
        routeParams: route.params,
        hasParams: !!route.params,
        doctorIdFromRoute: route.params?.doctor_id
      });

      // Try to get doctor_id from route first
      let doctor_id = route.params?.doctor_id;
      
      // If not in route, try to get from AsyncStorage
      if (!doctor_id) {
        console.log('⚠️ No doctor_id in route, checking AsyncStorage...');
        const userData = await AsyncStorage.getItem('userData');
        
        if (userData) {
          const parsedData = JSON.parse(userData);
          doctor_id = parsedData.doctor_id;
          console.log('📱 Found doctor_id in AsyncStorage:', doctor_id);
          console.log('👩‍⚕️ Full doctor data:', parsedData);
        }
      }

      if (doctor_id) {
        setDoctorId(doctor_id);
        console.log('✅ Doctor ID set:', doctor_id);
        // Fetch requests immediately after setting doctor ID
        fetchRequestsForDoctor(doctor_id);
      } else {
        console.error('❌ No doctor_id found anywhere');
        setLoading(false);
        Alert.alert(
          "Authentication Error",
          "Doctor ID not found. Please log in again.",
          [
            {
              text: "Go to Login",
              onPress: () => navigation.navigate("Login") // Adjust to your login screen name
            }
          ]
        );
      }
    } catch (error) {
      console.error('❌ Error getting doctor ID:', error);
      setLoading(false);
      Alert.alert("Error", "Failed to get user information. Please try again.");
    }
  };

  const fetchRequestsForDoctor = async (doctor_id) => {
    try {
      setLoading(true);
      console.log('📋 Fetching consultation requests for doctor:', doctor_id);
      
      const response = await getDoctorConsultations(doctor_id);
      console.log('📥 Received consultation requests:', response);
      
      setRequests(response || []);
    } catch (error) {
      console.error("❌ Fetch requests error:", error);
      
      // More specific error handling
      let errorMessage = "Failed to fetch consultation requests";
      if (error.response?.status === 404) {
        errorMessage = "No consultation requests found for this doctor";
        setRequests([]); // Set empty array for 404
      } else if (error.response?.status === 401) {
        errorMessage = "Authentication failed. Please log in again.";
      } else if (error.userMessage) {
        errorMessage = error.userMessage;
      }
      
      Alert.alert("Error", errorMessage);
      if (error.response?.status !== 404) {
        setRequests([]);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchRequests = () => {
    if (doctorId) {
      fetchRequestsForDoctor(doctorId);
    }
  };

  const onRefresh = () => {
    if (doctorId) {
      setRefreshing(true);
      fetchRequestsForDoctor(doctorId);
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

  const renderRequestItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("ConsultationDetailsScreen", { consultation: item })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.patientId}>Patient ID: {item.patient_id}</Text>
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

      <View style={styles.cardFooter}>
        <Text style={styles.consultantId}>Request ID: {item.consultant_id}</Text>
      </View>
    </TouchableOpacity>
  );

  // Show loading state while getting doctor ID
  if (doctorId === null && loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.loadingText}>Loading user information...</Text>
      </View>
    );
  }

  // Show error state if no doctor ID found
  if (doctorId === null && !loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Doctor ID not found</Text>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.buttonText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Consultation Requests</Text>
      <Text style={styles.subtitle}>Doctor ID: {doctorId}</Text>
      
      {loading && !refreshing ? (
        <View style={styles.centered}>
          <Text style={styles.loadingText}>Loading consultation requests...</Text>
        </View>
      ) : requests.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>No consultation requests found</Text>
          <TouchableOpacity style={styles.refreshButton} onPress={fetchRequests}>
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item) => item.consultant_id.toString()}
          renderItem={renderRequestItem}
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
    marginBottom: 10,
    textAlign: "center"
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20
  },
  loadingText: {
    fontSize: 16,
    color: "#666"
  },
  errorText: {
    fontSize: 16,
    color: "#f44336",
    textAlign: "center",
    marginBottom: 20
  },
  card: { 
    borderWidth: 1, 
    borderColor: "#ddd", 
    borderRadius: 10, 
    padding: 15, 
    marginBottom: 12,
    backgroundColor: "#fafafa",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8
  },
  patientId: {
    fontWeight: "600",
    fontSize: 16,
    color: "#333",
    flex: 1
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
    color: "#555",
    lineHeight: 20
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
  cardFooter: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#eee"
  },
  consultantId: {
    fontSize: 12,
    color: "#999",
    fontStyle: "italic"
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20
  },
  button: {
    backgroundColor: "#2e7d32",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16
  },
  refreshButton: {
    backgroundColor: "#2196f3",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6
  },
  refreshButtonText: {
    color: "#fff",
    fontWeight: "600"
  }
});

// HELPER FUNCTIONS FOR NAVIGATION

// Add this to your doctor login success handler
export const handleDoctorLoginSuccess = async (navigation, loginResponse) => {
  try {
    if (loginResponse.doctor) {
      const doctorData = {
        doctor_id: loginResponse.doctor.doctor_id,
        name: loginResponse.doctor.name,
        email: loginResponse.doctor.email,
        specialization: loginResponse.doctor.specialization,
        status: loginResponse.doctor.status,
        type: 'doctor'
      };
      
      await AsyncStorage.setItem('userData', JSON.stringify(doctorData));
      console.log('✅ Doctor data saved:', doctorData);
      
      // Navigate with doctor_id
      navigation.navigate("DoctorDashboard", { 
        doctor_id: loginResponse.doctor.doctor_id 
      });
    }
  } catch (error) {
    console.error('❌ Doctor login success handler error:', error);
  }
};

// Navigation helper for doctor consultation requests
export const navigateToDoctorConsultations = (navigation, doctorData) => {
  console.log('🧭 Navigating to doctor consultations with data:', doctorData);
  
  navigation.navigate("DoctorConsultationScreen", {
    doctor_id: doctorData.doctor_id,
    doctor_name: doctorData.name,
    specialization: doctorData.specialization
  });
};

// Debug component to check doctor data
export const DebugDoctorData = ({ navigation }) => {
  const checkDoctorData = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      const token = await AsyncStorage.getItem('token');
      
      console.log('🔍 Debug Doctor Data:', {
        hasUserData: !!userData,
        hasToken: !!token,
        userData: userData ? JSON.parse(userData) : null,
        tokenPreview: token ? `${token.substring(0, 20)}...` : null
      });
      
      const parsedData = userData ? JSON.parse(userData) : null;
      
      Alert.alert(
        "Doctor Debug Info",
        `Type: ${parsedData?.type}\nDoctor ID: ${parsedData?.doctor_id}\nName: ${parsedData?.name}\nHas Token: ${!!token}`,
        [
          {
            text: "Go to Consultations",
            onPress: () => {
              if (parsedData?.doctor_id) {
                navigation.navigate("ConsultationDetailsScreen", {
                  doctor_id: parsedData.doctor_id
                });
              } else {
                Alert.alert("Error", "No doctor ID found");
              }
            }
          },
          {
            text: "OK",
            style: "cancel"
          }
        ]
      );
    } catch (error) {
      console.error('❌ Debug error:', error);
      Alert.alert("Error", "Failed to get debug info");
    }
  };

  return (
    <TouchableOpacity 
      style={{ 
        padding: 20, 
        backgroundColor: "#f0f0f0", 
        margin: 10, 
        borderRadius: 8 
      }} 
      onPress={checkDoctorData}
    >
      <Text style={{ textAlign: "center", fontWeight: "600" }}>Debug Doctor Data</Text>
    </TouchableOpacity>
  );
};