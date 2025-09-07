import React, {useEffect, useState} from "react";
import { View, Text, StyleSheet } from "react-native";

export default function DoctorDashboardScreen({ route }) {
  const { doctor } = route.params;

  return (
    <View style={styles.headerContainer}>
      <Text style={styles.title}>Welcome, Dr. {doctor.name}</Text>
      
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#f8fffe' 
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#4a6741',
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  errorText: {
    color: '#e53e3e',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center'
  },
  container: {
    flexGrow: 1,
    backgroundColor: '#f8fffe',
    paddingBottom: 40,
  },
  
  // Header Styles - Doctor Theme
  headerContainer: {
     alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 30,
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // This won't work in RN but shows intent
    backgroundColor: '#667eea', // Fallback solid color
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
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 4,
    borderColor: '#4299e1',
  },
  avatarText: {
    fontSize: 38,
    fontWeight: '800',
    color: '#2c5aa0',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 0.8,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#cbd5e0',
    fontWeight: '500',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  statusBadge: {
    backgroundColor: '#f0fff4',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 25,
    marginTop: 15,
    borderWidth: 2,
    borderColor: '#48bb78',
    shadowColor: '#48bb78',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  statusText: {
    fontSize: 14,
    color: '#2f855a',
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },

  // Section Styles - Medical Theme
  sectionContainer: {
    marginHorizontal: 25,
    marginBottom: 25,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 10,
    borderLeftWidth: 6,
    borderLeftColor: '#4299e1',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#e2e8f0',
  },
  sectionIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e6f3ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    shadowColor: '#4299e1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionIcon: {
    fontSize: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a365d',
    flex: 1,
    letterSpacing: 0.5,
  },

  // Quick Stats for Doctor
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#f7fafc',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    borderTopWidth: 3,
    borderTopColor: '#48bb78',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2c5aa0',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#4a5568',
    fontWeight: '600',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Appointment Cards for Doctor
  appointmentCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    borderLeftWidth: 5,
    borderLeftColor: '#ed8936',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  patientName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  appointmentTime: {
    fontSize: 14,
    color: '#4299e1',
    fontWeight: '600',
  },
  appointmentReason: {
    fontSize: 15,
    color: '#64748b',
    lineHeight: 20,
    marginTop: 5,
  },

  // Empty State
  emptyStateContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  emptyStateIcon: {
    fontSize: 52,
    marginBottom: 18,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 6,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    letterSpacing: 0.2,
  },

  // Navigation Hint
  navigationHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 25,
    paddingVertical: 18,
    paddingHorizontal: 25,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#4a6741',
  },
  hintIcon: {
    fontSize: 22,
    marginRight: 12,
  },
  note: {
    fontSize: 15,
    color: '#4a5568',
    fontWeight: '500',
    textAlign: 'center',
    flex: 1,
    letterSpacing: 0.2,
  },
});