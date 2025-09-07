import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LanguageScreen({ navigation }) {
    const [selectedLanguage, setSelectedLanguage] = useState(null);

    const languages = [
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'si', name: 'සිංහල', flag: '🇱🇰' },
        { code: 'ta', name: 'தமிழ்', flag: '🇱🇰' },
    ];

    const handleLanguageSelect = async (language) => {
        setSelectedLanguage(language.code);
        await AsyncStorage.setItem('selectedLanguage', language.code);
        setTimeout(() => {
            navigation.navigate('UserType');
        }, 500);
    };

    return (
        <>
            <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />
            <LinearGradient colors={['#4CAF50', '#2196F3']} style={styles.container}>
                <View style={styles.content}>
                    <Text style={styles.title}>Select Language</Text>
                    <Text style={styles.subtitle}>Choose your preferred language</Text>

                    <View style={styles.languageContainer}>
                        {languages.map((language) => (
                            <TouchableOpacity
                                key={language.code}
                                style={[
                                    styles.languageButton,
                                    selectedLanguage === language.code && styles.selectedButton
                                ]}
                                onPress={() => handleLanguageSelect(language)}
                            >
                                <Text style={styles.flag}>{language.flag}</Text>
                                <Text style={styles.languageName}>{language.name}</Text>
                                {selectedLanguage === language.code && (
                                    <Text style={styles.checkmark}>✓</Text>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </LinearGradient>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: 'white',
        opacity: 0.9,
        marginBottom: 40,
        textAlign: 'center',
    },
    languageContainer: {
        width: '100%',
        maxWidth: 300,
    },
    languageButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: 20,
        marginBottom: 15,
        borderRadius: 15,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    selectedButton: {
        backgroundColor: 'white',
        transform: [{ scale: 1.05 }],
    },
    flag: {
        fontSize: 24,
        marginRight: 15,
    },
    languageName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        flex: 1,
    },
    checkmark: {
        fontSize: 20,
        color: '#4CAF50',
        fontWeight: 'bold',
    },
});