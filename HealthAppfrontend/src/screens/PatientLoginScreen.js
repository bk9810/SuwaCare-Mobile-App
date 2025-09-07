// PatientLoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { loginPatient } from '../services/api';
import { setSession } from '../services/session';
import { useTranslation } from "react-i18next";

export default function PatientLoginScreen({ route, navigation }) {
  const { t } = useTranslation();
  const { selectedLanguage } = route.params || { selectedLanguage: 'en' };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(t("error"), t("please_enter_email_password"));
      return;
    }

    try {
      const data = await loginPatient({ email, password });
      if (data.token) {
        await setSession({ token: data.token, patient: data.patient });
        navigation.replace("PatientDashboard", {
          token: data.token,
          patient: data.patient,
          selectedLanguage,
        });
      } else {
        Alert.alert(t("error"), data.message || t("invalid_credentials"));
      }
    } catch (error) {
      Alert.alert(t("error"), error?.response?.data?.message || t("something_went_wrong"));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("patient_login")}</Text>

      <TextInput
        style={styles.input}
        placeholder={t("email")}
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder={t("password")}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>{t("login")}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.replace("PatientRegistration", { selectedLanguage })}>
        <Text style={styles.linkText}>{t("register")}</Text>
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
 
  
  
});
