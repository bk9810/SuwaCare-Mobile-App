// PatientDashboardScreen.js
import React, { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, ActivityIndicator, Alert, ScrollView, 
  TouchableOpacity, Linking 
} from 'react-native';
import { getPatientProfile, getChronicDiseases, getPersonalizedTips  } from '../services/api';
import { Ionicons } from '@expo/vector-icons';
import Geolocation from 'react-native-geolocation-service'; // ✅ import geolocation

export default function PatientDashboardScreen({ route, navigation }) {
  const { token, patient, selectedLanguage } = route.params || {};
  const [patientData, setPatientData] = useState(patient || null);
  const [chronicDiseases, setChronicDiseases] = useState([]);
  const [loading, setLoading] = useState(!patient);
  const [location, setLocation] = useState(null);
  const [tips, setTips] = useState([]);
const [tipsLoading, setTipsLoading] = useState(true);

  const emergencyNumber = '1990';
  const hospitalLocation = 'https://maps.google.com/?q=nearest+hospital';

  useEffect(() => {
    if (!patientData && token) {
      fetchPatientProfile();
    } else if (patientData) {
      fetchChronicDiseases(patientData.patient_id);
      fetchPersonalizedTips(patientData.patient_id);
    }
  }, [patientData]);

  const fetchPatientProfile = async () => {
    try {
      setLoading(true);
      const patientId = patient?.id || patientData?.patient_id;
      if (!patientId) {
        Alert.alert('Error', 'Patient ID is missing.');
        setLoading(false);
        return;
      }
      const data = await getPatientProfile(patientId, token);
      if (data?.patient_id) {
        setPatientData(data);
        fetchChronicDiseases(data.patient_id);
      } else {
        Alert.alert('Error', data?.message || 'Failed to fetch profile.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const fetchChronicDiseases = async (patientId) => {
    try {
      const data = await getChronicDiseases(patientId, token);
      if (Array.isArray(data)) {
        setChronicDiseases(data);
      }
    } catch (error) {
      console.error("Error fetching chronic diseases:", error);
    }
  };

  const fetchPersonalizedTips = async (patientId) => {
  try {
    setTipsLoading(true);
    const data = await getPersonalizedTips(patientId);
    if (data && Array.isArray(data.tips)) {
      setTips(data.tips);
    } else {
      setTips([]);
    }
  } catch (error) {
    console.error("Error fetching tips:", error);
    setTips([]);
  } finally {
    setTipsLoading(false);
  }
};



  // ✅ Get Current Location (without permission lib)
  const getMyLocation = () => {
    Geolocation.getCurrentPosition(
      (pos) => {
        setLocation(pos.coords);
        const url = `https://www.google.com/maps?q=${pos.coords.latitude},${pos.coords.longitude}`;
        Linking.openURL(url);
      },
      (error) => {
        console.error(error);
        Alert.alert('Error', 'Unable to fetch location.');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading your dashboard...</Text>
      </View>
    );
  }

  if (!patientData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>No patient data available.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {patientData.name ? patientData.name.charAt(0).toUpperCase() : 'P'}
          </Text>
        </View>
        <Text style={styles.title}>Welcome back, {patientData.name}!</Text>
        <Text style={styles.subtitle}>Here's your health overview</Text>
      </View>

      {/* Chronic Diseases Section */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIconContainer}>
            <Text style={styles.sectionIcon}>🏥</Text>
          </View>
          <Text style={styles.sectionTitle}>Chronic Conditions</Text>
        </View>

        {chronicDiseases.length > 0 ? (
          <View style={styles.diseasesList}>
            {chronicDiseases.map((disease, idx) => (
              <View key={idx} style={styles.diseaseCard}>
                <View style={styles.diseaseHeader}>
                  <View style={styles.diseaseIndicator} />
                  <Text style={styles.diseaseName}>{disease.disease_name}</Text>
                </View>
                <Text style={styles.diseaseDescription}>{disease.description}</Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateIcon}>✨</Text>
            <Text style={styles.emptyStateText}>No chronic diseases recorded</Text>
            <Text style={styles.emptyStateSubtext}>That's great news for your health!</Text>
          </View>
        )}
      </View>
      {/* Personalized Tips Section */}
<View style={styles.sectionContainer}>
  <View style={styles.sectionHeader}>
    <View style={styles.sectionIconContainer}>
      <Text style={styles.sectionIcon}>💡</Text>
    </View>
    <Text style={styles.sectionTitle}>Personalized Tips</Text>
  </View>

  {tipsLoading ? (
    <ActivityIndicator size="small" color="#667eea" />
  ) : tips.length > 0 ? (
    tips.map((tip, index) => (
      <View key={index} style={styles.tipCard}>
        <Text style={styles.tipText}>{tip}</Text>
      </View>
    ))
  ) : (
    <Text style={styles.emptyStateText}>No tips available at the moment</Text>
  )}
</View>


      {/* Emergency Information Section */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIconContainer}>
            <Text style={styles.sectionIcon}>🚨</Text>
          </View>
          <Text style={styles.sectionTitle}>Emergency Information</Text>
        </View>

        <TouchableOpacity 
          style={styles.emergencyButton} 
          onPress={() => Linking.openURL(`tel:${emergencyNumber}`)}
        >
          <Ionicons name="call" size={20} color="#fff" />
          <Text style={styles.emergencyButtonText}>Call Emergency</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.emergencyButton, { backgroundColor: '#4CAF50' }]} 
          onPress={() => Linking.openURL(hospitalLocation)}
        >
          <Ionicons name="location" size={20} color="#fff" />
          <Text style={styles.emergencyButtonText}>Find Nearest Hospital</Text>
        </TouchableOpacity>

        {/* ✅ New Button: My Location */}
        <TouchableOpacity 
          style={[styles.emergencyButton, { backgroundColor: '#2196F3' }]} 
          onPress={getMyLocation}
        >
          <Ionicons name="navigate" size={20} color="#fff" />
          <Text style={styles.emergencyButtonText}>My Location</Text>
        </TouchableOpacity>
      </View>

      {/* Navigation Hint */}
      <View style={styles.navigationHint}>
        <Text style={styles.hintIcon}>💡</Text>
        <Text style={styles.note}>
          Use the tabs below to navigate through your dashboard.
        </Text>
      </View>
    </ScrollView>
  );
}




const styles = StyleSheet.create({
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#f8fafc' 
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500'
  },
  errorText: {
    color: '#ef4444',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center'
  },
  container: {
    flexGrow: 1,
    backgroundColor: '#f8fafc',
    paddingBottom: 40,
  },

  // Header Styles
  headerContainer: {
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 30,
    backgroundColor: '#667eea',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#667eea',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#e2e8f0',
    fontWeight: '500',
    textAlign: 'center',
  },

  // Section Styles
  sectionContainer: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionIcon: {
    fontSize: 22,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    flex: 1,
  },

  // Disease Cards
  diseasesList: {
    gap: 12,
  },
  diseaseCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  diseaseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  diseaseIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
    marginRight: 12,
  },
  diseaseName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    flex: 1,
  },
  diseaseDescription: {
    fontSize: 15,
    color: '#64748b',
    lineHeight: 22,
    marginLeft: 20,
  },

  // Emergency Info Buttons
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E53935',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginTop: 12,
  },
  emergencyButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },

  // Empty State
  emptyStateContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },

  // Navigation Hint
  navigationHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  hintIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  note: {
    fontSize: 15,
    color: '#64748b',
    fontWeight: '500',
    textAlign: 'center',
    flex: 1,
  },

  tipCard: {
  backgroundColor: '#f1f5f9',
  padding: 14,
  borderRadius: 12,
  marginBottom: 10,
  borderLeftWidth: 4,
  borderLeftColor: '#667eea',
},
tipText: {
  fontSize: 16,
  color: '#334155',
  fontWeight: '500',
},

});
