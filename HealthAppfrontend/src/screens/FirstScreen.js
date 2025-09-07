// src/screens/LanguageSelectionScreen.js/FirstScreen

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from "react-i18next";
import { LanguageContext } from "../context/LanguageContext";

export default function LanguageSelectionScreen({ navigation }) {
 const { changeLanguage, t } = useContext(LanguageContext);

   const selectLanguage = (lang) => {
    changeLanguage(lang);
    navigation.replace("RoleSelection");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("select_language")}</Text>
      <TouchableOpacity style={styles.button} onPress={() => selectLanguage("en")}>
        <Text>English</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => selectLanguage("si")}>
        <Text>සිංහල</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => selectLanguage("ta")}>
        <Text>தமிழ்</Text>
      </TouchableOpacity>
    </View>
  );
}

// keep your styles as-is


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
    subtitle: {
        fontSize: 16,
        color: '#4a6741',
        textAlign: 'center',
        fontWeight: '500',
        letterSpacing: 0.3,
        marginBottom: 35,
        lineHeight: 22,
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
    },
    button: {
        width: '85%',
        paddingVertical: 20,
        paddingHorizontal: 25,
        backgroundColor: '#48bb78',
        borderRadius: 18,
        alignItems: 'center',
        marginBottom: 18,
        shadowColor: '#48bb78',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
        elevation: 8,
        borderLeftWidth: 6,
        borderLeftColor: '#38a169',
        transform: [{ scale: 1 }],
    },
    sinhalaButton: {
        backgroundColor: '#ed8936',
        shadowColor: '#ed8936',
        borderLeftColor: '#dd6b20',
    },
    tamilButton: {
        backgroundColor: '#9f7aea',
        shadowColor: '#9f7aea',
        borderLeftColor: '#805ad5',
    },
    englishButton: {
        backgroundColor: '#4299e1',
        shadowColor: '#4299e1',
        borderLeftColor: '#3182ce',
    },
    buttonText: {
        fontSize: 20,
        color: 'white',
        fontWeight: '700',
        letterSpacing: 0.8,
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    buttonPressed: {
        transform: [{ scale: 0.96 }],
        shadowOpacity: 0.2,
        elevation: 4,
    },
    flagEmoji: {
        fontSize: 24,
        marginLeft: 8,
    },
    languageCode: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        fontWeight: '500',
        marginTop: 4,
    },
    selectionHint: {
        backgroundColor: '#ffffff',
        padding: 15,
        borderRadius: 12,
        marginTop: 25,
        width: '90%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 6,
        borderLeftWidth: 4,
        borderLeftColor: '#4a6741',
    },
    hintText: {
        fontSize: 14,
        color: '#4a5568',
        textAlign: 'center',
        fontWeight: '500',
        fontStyle: 'italic',
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 12,
        color: '#718096',
        fontWeight: '500',
        letterSpacing: 0.5,
    },
});