import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, TouchableWithoutFeedback } from 'react-native';

export default function WelcomeScreen({ navigation }) {
  // Use useRef for animated values to prevent recreation on re-renders
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  const [tapCount, setTapCount] = useState(0);
  const [showHiddenButton, setShowHiddenButton] = useState(false);

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
  }, [fadeAnim, slideAnim]);

  const handleScreenTap = () => {
    const newCount = tapCount + 1;

    // 4 taps reached
    if (newCount >= 4) {
      setShowHiddenButton(prev => !prev); // toggle visibility
      setTapCount(0); // reset counter
    } else {
      setTapCount(newCount);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handleScreenTap}>
      <View style={styles.container}>
        <View style={styles.backgroundOverlay} />

        <Animated.View 
          style={[
            styles.headerContainer,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}
        >
          <View style={styles.logoContainer}>
            <View style={styles.logoIcon}>
              <Text style={styles.logoText}>+</Text>
            </View>
          </View>
          <Text style={styles.appName}>SuwaCare</Text>
          <Text style={styles.tagline}>Together for Lifelong Care</Text>
        </Animated.View>

        <Animated.View 
          style={[
            styles.welcomeContainer,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}
        >
          <Text style={styles.welcomeTitle}>Welcome to SuwaCare</Text>
          <Text style={styles.welcomeSubtitle}>
            Support for every step of your chronic care journey.
          </Text>
        </Animated.View>

        <Animated.View 
          style={[
            styles.buttonContainer,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}
        >
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('LanguageSelection')}
          >
            <Text style={styles.primaryButtonText}>Get Started</Text>
          </TouchableOpacity>

          {showHiddenButton && (
            <TouchableOpacity
              style={styles.hiddenButton}
              onPress={() => navigation.navigate('DoctorLogin')}
            >
              <Text style={styles.hiddenButtonText}>Staff Login</Text>
            </TouchableOpacity>
          )}
        </Animated.View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Secure • Reliable • Professional</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f0f8ff', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingVertical: 50, 
    paddingHorizontal: 25 
  },
  backgroundOverlay: { 
    position: 'absolute', 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0, 
    backgroundColor: '#e6f3ff', 
    opacity: 0.8 
  },
  headerContainer: { 
    alignItems: 'center', 
    marginTop: 60, // Increased margin for better spacing
    flex: 1,
    justifyContent: 'center'
  },
  logoContainer: { 
    marginBottom: 25 
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
    borderColor: '#48bb78' 
  },
  logoText: { 
    fontSize: 48, 
    fontWeight: '900', 
    color: '#2c5aa0', 
    textShadowColor: 'rgba(44, 90, 160, 0.3)', 
    textShadowOffset: { width: 0, height: 2 }, 
    textShadowRadius: 4 
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
    textAlign: 'center'
  },
  tagline: { 
    fontSize: 18, 
    color: '#4a6741', 
    fontWeight: '500', 
    letterSpacing: 0.8, 
    textAlign: 'center', 
    fontStyle: 'italic' 
  },
  welcomeContainer: { 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    flex: 1,
    justifyContent: 'center'
  },
  welcomeTitle: { 
    fontSize: 28, 
    fontWeight: '700', 
    color: '#2c5aa0', 
    textAlign: 'center', 
    marginBottom: 15, 
    letterSpacing: 0.5 
  },
  welcomeSubtitle: { 
    fontSize: 16, 
    color: '#4a5568', 
    textAlign: 'center', 
    lineHeight: 24, 
    letterSpacing: 0.3, 
    fontWeight: '400' 
  },
  buttonContainer: { 
    width: '100%', 
    alignItems: 'center', 
    marginBottom: 20 
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
    borderLeftColor: '#38a169' 
  },
  primaryButtonText: { 
    color: '#ffffff', 
    fontSize: 20, 
    fontWeight: '700', 
    letterSpacing: 1, 
    textTransform: 'uppercase' 
  },
  hiddenButton: { 
    width: '90%', 
    backgroundColor: '#4299e1', 
    paddingVertical: 15, 
    borderRadius: 20, 
    alignItems: 'center', 
    marginTop: 10 
  },
  hiddenButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600'
  },
  footer: { 
    alignItems: 'center', 
    marginBottom: 10 
  },
  footerText: { 
    fontSize: 14, 
    color: '#718096', 
    fontWeight: '500', 
    letterSpacing: 0.5, 
    textAlign: 'center' 
  },
});