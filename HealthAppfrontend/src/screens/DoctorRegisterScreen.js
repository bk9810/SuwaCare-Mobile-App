import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { registerDoctor } from "../services/api";

export default function DoctorRegistrationScreen({ navigation, route }) {
  const selectedLanguage = route?.params?.selectedLanguage || "English";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [phone, setPhone] = useState("");

  const handleRegister = async () => {
    if (!name || !email || !password || !specialization || !phone) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      const data = await registerDoctor({ name, email, password, specialization, phone });

      if (data.doctor) {
        Alert.alert("Success", "Registration submitted. Waiting for Admin approval.");
        navigation.navigate("DoctorLogin", { selectedLanguage });
      } else {
        Alert.alert("Error", data.message || "Registration failed.");
      }
    } catch (err) {
      console.error("Register Error:", err);
      Alert.alert("Error", "Something went wrong while registering.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Doctor Registration</Text>
      <TextInput
        placeholder="Full Name"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        placeholder="Specialization"
        style={styles.input}
        value={specialization}
        onChangeText={setSpecialization}
      />
      <TextInput
        placeholder="Phone"
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.replace("DoctorLogin", { selectedLanguage })}
      >
        <Text style={styles.linkText}>Already have an account? Login</Text>
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