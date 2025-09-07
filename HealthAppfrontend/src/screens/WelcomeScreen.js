// WelcomeScreen.js
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';

export default function WelcomeScreen({ navigation }) {
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Background Gradient Effect */}
      <View style={styles.backgroundOverlay} />
      
      {/* Header Section */}
      <Animated.View 
        style={[
          styles.headerContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <View style={styles.logoContainer}>
          <View style={styles.logoIcon}>
            <Text style={styles.logoText}>+</Text>
          </View>
        </View>
        
        <Text style={styles.appName}>SuwaCare</Text>
        <Text style={styles.tagline}>Together for Lifelong Carey</Text>
      </Animated.View>

      {/* Welcome Message */}
      <Animated.View 
        style={[
          styles.welcomeContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <Text style={styles.welcomeTitle}>Welcome to SuwaCare</Text>
        <Text style={styles.welcomeSubtitle}>
          Support for every step of your chronic care journey.
        </Text>
      </Animated.View>

      {/* Action Buttons */}
      <Animated.View 
        style={[
          styles.buttonContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('LanguageSelection')}
        >
          <Text style={styles.primaryButtonText}>Get Started</Text>
        </TouchableOpacity>
        
       
      </Animated.View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Secure • Reliable • Professional</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 50,
    paddingHorizontal: 25,
  },
  backgroundOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 50%, #dbeafe 100%)',
    opacity: 0.8,
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  logoContainer: {
    marginBottom: 25,
  },
  logoIcon: {
    width: 120,
    height: 120,
    backgroundColor: '#ffffff',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2c5aa0',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 15,
    borderWidth: 6,
    borderColor: '#48bb78',
  },
  logoText: {
    fontSize: 48,
    fontWeight: '900',
    color: '#2c5aa0',
    textShadowColor: 'rgba(44, 90, 160, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  appName: {
    fontSize: 42,
    fontWeight: '800',
    color: '#1a365d',
    marginBottom: 8,
    letterSpacing: 1.5,
    textShadowColor: 'rgba(26, 54, 93, 0.2)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
  tagline: {
    fontSize: 18,
    color: '#4a6741',
    fontWeight: '500',
    letterSpacing: 0.8,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  welcomeContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginVertical: 30,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2c5aa0',
    textAlign: 'center',
    marginBottom: 15,
    letterSpacing: 0.5,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#4a5568',
    textAlign: 'center',
    lineHeight: 24,
    letterSpacing: 0.3,
    fontWeight: '400',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  primaryButton: {
    width: '90%',
    backgroundColor: '#48bb78',
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#48bb78',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
    borderLeftWidth: 6,
    borderLeftColor: '#38a169',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  secondaryButton: {
    width: '90%',
    backgroundColor: 'transparent',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4299e1',
  },
  secondaryButtonText: {
    color: '#4299e1',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#718096',
    fontWeight: '500',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  // Additional styles for enhanced medical theme
  medicalBadge: {
    position: 'absolute',
    top: 60,
    right: 30,
    backgroundColor: '#48bb78',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    shadowColor: '#48bb78',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  featureHighlight: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 15,
    marginVertical: 15,
    width: '95%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    borderLeftWidth: 5,
    borderLeftColor: '#4299e1',
  },
  highlightTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c5aa0',
    marginBottom: 8,
    textAlign: 'center',
  },
  highlightText: {
    fontSize: 14,
    color: '#4a5568',
    textAlign: 'center',
    lineHeight: 20,
  },
});