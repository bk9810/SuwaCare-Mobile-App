import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function LanguageSelectionScreen({ navigation, route }) {
  const selectedLanguage = route?.params?.selectedLanguage || 'English';

  const handleSelectLanguage = (lang) => {
    console.log("Selected language:", lang);
    navigation.navigate("PatientLogin", { selectedLanguage: lang });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Language</Text>
      <TouchableOpacity style={styles.button} onPress={() => handleSelectLanguage('English')}>
        <Text style={styles.buttonText}>English</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => handleSelectLanguage('Sinhala')}>
        <Text style={styles.buttonText}>Sinhala</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => handleSelectLanguage('Tamil')}>
        <Text style={styles.buttonText}>Tamil</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
     flex: 1, 
     justifyContent: 'center', 
     alignItems: 'center', 
     backgroundColor: '#fff', 
     padding: 25, 
     paddingTop: 50, 
    },
  title: { 
    fontSize: 34, 
    fontWeight: '800', 
    marginBottom: 40, 
    textAlign: "center", 
    color: '#1a365d', 
    letterSpacing: 1.2, 
    textDecorationLine: 'underline', 
    textDecorationColor: '#4299e1', 
    textShadowColor: 'rgba(26, 54, 93, 0.3)', 
    textShadowOffset:{width: 0, height: 3}, 
    textShadowRadius: 6, },
  button: { 
    backgroundColor: "#4299e1", 
    paddingVertical: 15,
    paddingHorizontal: 75, 
    borderRadius: 15,
    marginTop: 30,
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
});
