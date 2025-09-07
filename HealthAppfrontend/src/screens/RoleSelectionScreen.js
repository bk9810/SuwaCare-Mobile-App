// src/screens/RoleSelectionScreen.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function RoleSelectionScreen({ navigation }) {
  const [language, setLanguage] = useState('en'); // default English

  // Manual translations
  const translations = {
    en: { select_role: 'Select Your Role', patient: 'Patient', doctor: 'Doctor' },
    si: { select_role: 'ඔබේ භූමිකාව තෝරන්න', patient: 'රෝගියා', doctor: 'වෛද්‍ය' },
    ta: { select_role: 'உங்கள் பாத்திரத்தைத் தேர்ந்தெடுக்கவும்', patient: 'நோயாளர்', doctor: 'மருத்துவர்' },
  };

  const t = translations[language];

  return (
    <View style={styles.container}>
      {/* Language Switch Buttons */}
      <View style={styles.languageContainer}>
        <TouchableOpacity onPress={() => setLanguage('en')} style={styles.langBtn}>
          <Text style={styles.langText}>EN</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setLanguage('si')} style={styles.langBtn}>
          <Text style={styles.langText}>සිං</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setLanguage('ta')} style={styles.langBtn}>
          <Text style={styles.langText}>தமிழ்</Text>
        </TouchableOpacity>
      </View>

      {/* Title */}
      <Text style={styles.title}>{t.select_role}</Text>

      {/* Buttons */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('PatientLogin')}
      >
        <Text style={styles.buttonText}>{t.patient}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('DoctorLogin')}
      >
        <Text style={styles.buttonText}>{t.doctor}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 25, 
    backgroundColor: '#f0f8ff',
  },
  languageContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  langBtn: {
    marginHorizontal: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#3182ce',
    borderRadius: 8,
  },
  langText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  title: { 
    fontSize: 32, 
    fontWeight: '800', 
    marginBottom: 40,
    color: '#1a365d',
    textAlign: 'center',
    letterSpacing: 1.2,
    textShadowColor: 'rgba(26, 54, 93, 0.3)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
    textDecorationLine: 'underline',
    textDecorationColor: '#4299e1',
  },
  button: { 
    width: '85%', 
    paddingVertical: 18,
    paddingHorizontal: 30,
    backgroundColor: '#48bb78',
    borderRadius: 20, 
    alignItems: 'center', 
    marginBottom: 20,
    borderLeftWidth: 8,
    borderLeftColor: '#38a169',
  },
  buttonText: { 
    color: '#ffffff', 
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
