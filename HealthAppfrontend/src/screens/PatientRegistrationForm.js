// src/screens/PatientRegistrationForm.js
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import api from "../services/api";

export default function PatientRegistrationForm({ navigation }) {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    nic: "",
    date_of_birth: "",
    gender: "",
    address: "",
    email: "",
    password: "",
    preferred_language: "si",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const validateForm = () => {
    const requiredFields = ['first_name', 'last_name', 'phone_number', 'nic', 'date_of_birth', 'gender', 'email', 'password'];
    
    for (const field of requiredFields) {
      if (!form[field].trim()) {
        Alert.alert("Validation Error", `${field.replace('_', ' ')} is required`);
        return false;
      }
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      Alert.alert("Validation Error", "Please enter a valid email address");
      return false;
    }

    // Password length validation
    if (form.password.length < 6) {
      Alert.alert("Validation Error", "Password must be at least 6 characters long");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (isLoading) return; // Prevent double submission

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      console.log("📤 Sending registration data:", form);
      
      const response = await api.post("/patients", form);
      
      console.log("✅ Registration successful:", response.data);
      
      Alert.alert("✅ Success", "Patient registered successfully!", [
        { 
          text: "OK", 
          onPress: () => navigation.navigate("Login") 
        }
      ]);

    } catch (err) {
      console.error("❌ Registration error:", err);
      
      const errorMessage = err.response?.data?.error || 
                          err.message || 
                          "Registration failed. Please try again.";
                          
      Alert.alert("Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Patient Registration</Text>

      {["first_name", "last_name", "phone_number", "nic", "date_of_birth", "gender", "address", "email", "password"].map((field) => (
        <TextInput
          key={field}
          style={styles.input}
          placeholder={field.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
          secureTextEntry={field === "password"}
          value={form[field]}
          onChangeText={(val) => handleChange(field, val)}
          autoCapitalize={field === "email" ? "none" : "words"}
          keyboardType={field === "email" ? "email-address" : "default"}
        />
      ))}

      <TouchableOpacity 
        onPress={handleSubmit} 
        style={[styles.button, isLoading && styles.buttonDisabled]}
        disabled={isLoading}
      >
        <LinearGradient colors={["#4CAF50", "#22C55E"]} style={styles.gradient}>
          <Text style={styles.buttonText}>
            {isLoading ? "Registering..." : "Register"}
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.loginLink}> Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
    fontSize: 32, 
    fontWeight: "800", 
    marginBottom: 35, 
    textAlign: "center",
    color: '#1a365d',
    letterSpacing: 1,
    textDecorationLine: 'underline',
    textDecorationColor: '#4299e1',
    textShadowColor: 'rgba(26, 54, 93, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#4a6741',
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: '500',
    letterSpacing: 0.3,
    lineHeight: 22,
  },
  formContainer: {
    backgroundColor: '#ffffff',
    padding: 25,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 12,
    borderTopWidth: 4,
    borderTopColor: '#48bb78',
  },
  input: { 
    borderWidth: 2, 
    borderColor: "#cbd5e0", 
    padding: 16, 
    marginBottom: 18, 
    borderRadius: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
    color: '#2d3748',
    fontWeight: '500',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  inputFocused: {
    borderColor: '#4299e1',
    borderWidth: 3,
    shadowColor: '#4299e1',
    shadowOpacity: 0.2,
  },
  button: { 
    backgroundColor: "#48bb78", 
    paddingVertical: 18,
    paddingHorizontal: 30, 
    borderRadius: 15, 
    marginTop: 25,
    shadowColor: '#48bb78',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
    borderLeftWidth: 6,
    borderLeftColor: '#38a169',
  },
  buttonText: { 
    color: "#ffffff", 
    textAlign: "center", 
    fontWeight: "700",
    fontSize: 20,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  buttonPressed: {
    transform: [{ scale: 0.96 }],
    shadowOpacity: 0.2,
    elevation: 6,
  },
  linkText: { 
    color: "#4299e1", 
    marginTop: 20, 
    textAlign: "center",
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
    textDecorationLine: 'underline',
  },
  linkPressed: {
    color: '#2c5aa0',
  },
  headerIcon: {
    width: 80,
    height: 80,
    backgroundColor: '#e6fffa',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
    shadowColor: '#48bb78',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 3,
    borderColor: '#48bb78',
  },
  iconText: {
    fontSize: 32,
    color: '#48bb78',
    fontWeight: '800',
  },
  requiredField: {
    position: 'absolute',
    right: 12,
    top: 16,
    color: '#e53e3e',
    fontSize: 18,
    fontWeight: 'bold',
  },
  fieldContainer: {
    position: 'relative',
    marginBottom: 5,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4a6741',
    marginBottom: 8,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  professionalNote: {
    backgroundColor: '#fffbf0',
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#ed8936',
  },
  noteText: {
    fontSize: 14,
    color: '#744210',
    textAlign: 'center',
    fontWeight: '500',
    fontStyle: 'italic',
  },
});