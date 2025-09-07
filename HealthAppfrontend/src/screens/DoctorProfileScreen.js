import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import axios from 'axios';
import { getDoctorSession, clearDoctorSession } from '../services/session';
import { CommonActions } from '@react-navigation/native';

const DoctorProfileScreen = ({ navigation }) => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: ''
  });

  const [extendedProfile, setExtendedProfile] = useState({
    bio: '',
    sub_specialization: '',
    experience_years: '',
    qualifications: '',
    languages_spoken: []
  });

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleLogout = async () => {
    await clearDoctorSession();
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'DoctorLoginScreen' }]
      })
    );
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const session = await getDoctorSession();
        if (!session?.doctor_id || !session?.token) {
          Alert.alert("Session expired", "Please login again.", [{ text: "OK", onPress: handleLogout }]);
          return;
        }

        // Fetch main doctor profile
        const mainRes = await axios.get(
          `http://10.195.21.165:5000/api/doctors/${session.doctor_id}`,
          { headers: { Authorization: `Bearer ${session.token}` } }
        );
        setProfile(mainRes.data);

        // Fetch extended profile
        const extRes = await axios.get(
          `http://10.195.21.165:5000/api/doctor_profiles/${session.doctor_id}`,
          { headers: { Authorization: `Bearer ${session.token}` } }
        );
        setExtendedProfile(extRes.data || { bio: '', sub_specialization: '', experience_years: '', qualifications: '', languages_spoken: [] });

      } catch (err) {
        console.error("Fetch Profile Error:", err);
        Alert.alert("Error", "Failed to fetch profile");
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
    const response = await axios.put(
  `http://10.195.21.165:5000/api/doctor_profiles/${session.doctor_id}`,
  {
    bio: extendedProfile.bio,
    sub_specialization: extendedProfile.sub_specialization,
    experience_years: parseInt(extendedProfile.experience_years || '0'),
    qualifications: extendedProfile.qualifications,
    languages_spoken: extendedProfile.languages_spoken,
  },
  { headers: { Authorization: `Bearer ${session.token}` } }
);
      setProfile(response.data.doctor);
      setEditing(false);
      Alert.alert("Success", "Profile updated successfully!");
    } catch (err) {
      console.error("Update Profile Error:", err);
      Alert.alert("Error", "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Doctor Profile</Text>

      {/* Main Profile */}
      <TextInput
        style={[styles.input, !editing && styles.disabledInput]}
        placeholder="Full Name"
        value={profile.name}
        editable={editing}
        onChangeText={text => setProfile({ ...profile, name: text })}
      />
      <TextInput style={[styles.input, styles.disabledInput]} placeholder="Email" value={profile.email} editable={false} />
      <TextInput
        style={[styles.input, !editing && styles.disabledInput]}
        placeholder="Phone"
        value={profile.phone}
        editable={editing}
        onChangeText={text => setProfile({ ...profile, phone: text })}
      />
      <TextInput
        style={[styles.input, !editing && styles.disabledInput]}
        placeholder="Specialization"
        value={profile.specialization}
        editable={editing}
        onChangeText={text => setProfile({ ...profile, specialization: text })}
      />

      {editing ? (
        <View style={styles.buttonContainer}>
          <Button title={saving ? "Saving..." : "Save"} onPress={handleSave} disabled={saving} />
          <View style={styles.buttonSpacing} />
          <Button title="Cancel" onPress={() => setEditing(false)} color="#666" />
        </View>
      ) : (
        <View style={styles.buttonContainer}>
          <Button title="Edit Profile" onPress={() => setEditing(true)} />
          <View style={styles.buttonSpacing} />
          <Button title="Edit Extended Profile" onPress={() => navigation.navigate('DoctorExtendedProfileScreen')} />
        </View>
      )}

      {/* Extended Profile Preview */}
      <View style={styles.extendedContainer}>
        <Text style={styles.subTitle}>Extended Profile</Text>
        {extendedProfile.bio ? <Text style={styles.text}><Text style={styles.bold}>Bio:</Text> {extendedProfile.bio}</Text> : null}
        {extendedProfile.sub_specialization ? <Text style={styles.text}><Text style={styles.bold}>Sub-specialization:</Text> {extendedProfile.sub_specialization}</Text> : null}
        {extendedProfile.experience_years ? <Text style={styles.text}><Text style={styles.bold}>Experience:</Text> {extendedProfile.experience_years} years</Text> : null}
        {extendedProfile.qualifications ? <Text style={styles.text}><Text style={styles.bold}>Qualifications:</Text> {extendedProfile.qualifications}</Text> : null}
        {extendedProfile.languages_spoken?.length ? <Text style={styles.text}><Text style={styles.bold}>Languages:</Text> {extendedProfile.languages_spoken.join(', ')}</Text> : null}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  centered: { justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#333' },
  subTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10, color: '#444' },
  input: { borderBottomWidth: 1, borderBottomColor: '#ddd', padding: 10, marginBottom: 15, backgroundColor: '#fff', fontSize: 16 },
  disabledInput: { backgroundColor: '#f9f9f9', color: '#666' },
  text: { fontSize: 16, marginBottom: 8, color: '#333' },
  bold: { fontWeight: 'bold' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#666' },
  buttonContainer: { marginTop: 20 },
  buttonSpacing: { height: 10 },
  extendedContainer: { marginTop: 20, padding: 15, backgroundColor: '#fff', borderRadius: 8, shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, elevation: 2 },
});

export default DoctorProfileScreen;
