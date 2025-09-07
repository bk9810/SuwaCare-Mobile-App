import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { getDoctorSession } from '../services/session';

const DoctorExtendedProfileScreen = ({ navigation }) => {
  const [profile, setProfile] = useState({
    bio: '',
    sub_specialization: '',
    experience_years: '',
    qualifications: '',
    languages_spoken: [], // array of strings
  });

  const [editing, setEditing] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const session = await getDoctorSession();
        if (!session || !session.doctor_id || !session.token) {
          Alert.alert("Session expired", "Please login again.");
          return;
        }

        const res = await axios.get(
          `http://10.195.21.165:5000/api/doctor_profiles/${session.doctor_id}`,
          { headers: { Authorization: `Bearer ${session.token}` } }
        );

        if (res.data) {
          setProfile({
            bio: res.data.bio || '',
            sub_specialization: res.data.sub_specialization || '',
            experience_years: res.data.experience_years?.toString() || '',
            qualifications: res.data.qualifications || '',
            languages_spoken: Array.isArray(res.data.languages_spoken) 
              ? res.data.languages_spoken 
              : [],
          });
        }
      } catch (err) {
        console.error("Fetch Extended Profile Error:", err);
        
        // Handle specific 404 error - profile doesn't exist yet
        if (err.response?.status === 404) {
          console.log("No extended profile found, using defaults");
          // Keep the default empty state - don't show error to user
          setProfile({
            bio: '',
            sub_specialization: '',
            experience_years: '',
            qualifications: '',
            languages_spoken: []
          });
        } else {
          // Only show error for non-404 errors
          Alert.alert("Error", err.response?.data?.error || "Failed to load profile");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      const session = await getDoctorSession();

      // Ensure experience_years is a valid number or null
      const experienceYears = profile.experience_years 
        ? parseInt(profile.experience_years) || 0 
        : 0;

      await axios.put(
        `http://10.195.21.165:5000/api/doctor_profiles/${session.doctor_id}`,
        {
          bio: profile.bio || '',
          sub_specialization: profile.sub_specialization || '',
          experience_years: experienceYears,
          qualifications: profile.qualifications || '',
          languages_spoken: Array.isArray(profile.languages_spoken) 
            ? profile.languages_spoken.filter(lang => lang.trim() !== '')
            : [],
        },
        { headers: { Authorization: `Bearer ${session.token}` } }
      );

      Alert.alert("Success", "Extended profile updated!");
      setEditing(false);
      navigation.goBack(); // Return to main profile screen
    } catch (err) {
      console.error("Save Extended Profile Error:", err);
      Alert.alert("Error", err.response?.data?.error || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={styles.loadingText}>Loading extended profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Extended Profile</Text>

      <TextInput
        style={styles.input}
        placeholder="Bio / About Me"
        value={profile.bio}
        editable={editing}
        multiline
        numberOfLines={4}
        onChangeText={(text) => setProfile({ ...profile, bio: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Sub-specialization"
        value={profile.sub_specialization}
        editable={editing}
        onChangeText={(text) => setProfile({ ...profile, sub_specialization: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Years of Experience"
        value={profile.experience_years}
        editable={editing}
        keyboardType="numeric"
        onChangeText={(text) => setProfile({ ...profile, experience_years: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Qualifications"
        value={profile.qualifications}
        editable={editing}
        onChangeText={(text) => setProfile({ ...profile, qualifications: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Languages Spoken (comma separated)"
        value={Array.isArray(profile.languages_spoken) ? profile.languages_spoken.join(', ') : ''}
        editable={editing}
        onChangeText={(text) =>
          setProfile({ 
            ...profile, 
            languages_spoken: text.split(',').map(lang => lang.trim()).filter(lang => lang !== '')
          })
        }
      />

      <View style={styles.buttonContainer}>
        <Button title={saving ? "Saving..." : "Save"} onPress={handleSave} disabled={saving} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  centered: { justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#333' },
  input: { borderBottomWidth: 1, borderBottomColor: '#ddd', padding: 10, marginBottom: 15, backgroundColor: '#fff', fontSize: 16 },
  loadingText: { marginTop: 10, fontSize: 16, color: '#666' },
  buttonContainer: { marginTop: 20 },
});

export default DoctorExtendedProfileScreen;