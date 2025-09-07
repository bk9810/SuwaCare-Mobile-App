import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { loginDoctor } from "../services/api";
import { setDoctorSession } from "../services/session";

export default function DoctorLoginScreen({ route, navigation }) {
  const { selectedLanguage } = route.params || { selectedLanguage: "English" };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      const response = await loginDoctor({ email, password });

      console.log("✅ Login Response:", response);

      // ✅ Save doctor session using updated session service
      if (response.token && response.doctor) {
        await setDoctorSession({
          token: response.token,
          doctor: response.doctor, // Contains doctor_id, name, email, etc.
        });
        console.log("📱 Doctor session saved successfully");
      }

      // ✅ Use response.doctor.status instead of response.status
      if (response.doctor.status === "APPROVED") {
        // Navigate to DoctorDashboard and pass doctor data
        navigation.replace("DoctorDashboard", { doctor: response.doctor });
      } else if (response.doctor.status === "PENDING") {
        Alert.alert("Approval Pending", "Your account is waiting for admin approval.");
      } else if (response.doctor.status === "REJECTED") {
        Alert.alert("Rejected", "Your account was rejected by the admin.");
      } else {
        Alert.alert("Error", response.message || "Login failed.");
      }
    } catch (err) {
      console.error("❌ Login Error:", err);
      
      // Enhanced error handling
      if (err.response) {
        const { status, data } = err.response;
        
        if (status === 403) {
          if (data.status === 'PENDING') {
            Alert.alert('Approval Pending', 'Your account is waiting for admin approval.');
          } else if (data.status === 'REJECTED') {
            Alert.alert('Account Rejected', 'Your account has been rejected by admin.');
          } else {
            Alert.alert('Access Denied', data.message || 'Login failed');
          }
        } else if (status === 404) {
          Alert.alert('Login Failed', 'Doctor not found. Please check your email.');
        } else if (status === 401) {
          Alert.alert('Login Failed', 'Invalid password. Please try again.');
        } else {
          Alert.alert('Login Failed', data.error || 'Something went wrong');
        }
      } else if (err.request) {
        Alert.alert('Network Error', 'Please check your internet connection');
      } else {
        Alert.alert("Error", "Invalid login credentials or server issue.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Doctor Login</Text>
      
      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        editable={!loading}
      />
      
      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        autoComplete="password"
        editable={!loading}
      />
      
      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Logging in..." : "Login"}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={() => navigation.replace("DoctorRegistration", { selectedLanguage })}
        disabled={loading}
      >
        <Text style={[styles.linkText, loading && styles.linkTextDisabled]}>
          Don't have an account? Register
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 25, 
    justifyContent: "center",
    backgroundColor: '#f8fffe',
    paddingTop: 50,
  },
  title: { 
    fontSize: 34, 
    fontWeight: "800", 
    marginBottom: 40, 
    textAlign: "center",
    color: '#1a365d',
    letterSpacing: 1.2,
    textDecorationLine: 'underline',
    textDecorationColor: '#4299e1',
    textShadowColor: 'rgba(26, 54, 93, 0.3)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
 
  iconText: {
    fontSize: 40,
    color: '#2c5aa0',
    fontWeight: '800',
  },
 
  input: { 
    borderWidth: 2, 
    borderColor: "#e2e8f0", 
    padding: 18, 
    marginBottom: 18, 
    borderRadius: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
    color: '#2d3748',
    fontWeight: '500',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  
  button: { 
    backgroundColor: "#4299e1", 
    paddingVertical: 20,
    paddingHorizontal: 35, 
    borderRadius: 15,
    marginTop: 15,
    shadowColor: '#4299e1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
    borderLeftWidth: 6,
    borderLeftColor: '#3182ce',
  },
  
  buttonDisabled: {
    backgroundColor: "#a0aec0",
    shadowOpacity: 0.2,
    borderLeftColor: '#718096',
  },
  
  buttonText: { 
    color: "#ffffff", 
    textAlign: "center", 
    fontWeight: "700",
    fontSize: 20,
    letterSpacing: 1,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
 
  linkText: { 
    color: "#48bb78", 
    marginTop: 25, 
    textAlign: "center",
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
    textDecorationLine: 'underline',
  },
  
  linkTextDisabled: {
    color: "#a0aec0",
  },
});