import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { getSession } from '../services/session';

// ✅ Stub helper (replace with real API later)
const getChronicDiseases = async (patientId, token) => {
  const res = await axios.get(
    `http://10.195.21.165:5000/api/chronic-diseases/${patientId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data || [];
};


const addChronicDisease = async (patientId, token, disease) => {
  const res = await axios.post(
    `http://10.195.21.165:5000/api/chronic-diseases/${patientId}`,
    disease,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

const ProfileScreen = ({ navigation, route }) => {
  const { token, patientId } = route.params || {};
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDiseaseForm, setShowDiseaseForm] = useState(false);
  const [diseases, setDiseases] = useState([]);
  const [newDisease, setNewDisease] = useState({
    disease_name: '',
    description: '',
    diagnosed_date: '',
  });

  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    age: '',
  });

  const [tempProfile, setTempProfile] = useState({});

  // 🔹 Helper functions
  const calculateAge = (dob) => {
    if (!dob) return '';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age.toString();
  };

  const convertAgeToDOB = (age) => {
    if (!age) return null;
    const today = new Date();
    const year = today.getFullYear() - parseInt(age, 10);
    return `${year}-01-01`; // default to Jan 1
  };

  // ✅ Fetch profile + diseases
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { token, patient } = await getSession();
        if (!token || !patient?.patient_id) {
          Alert.alert('Error', 'No session found');
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://10.195.21.165:5000/api/patients/${patient.patient_id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setProfile({
          fullName: response.data.name,
          email: response.data.email,
          phone: response.data.phone,
          address: response.data.address,
          age: calculateAge(response.data.dob),
        });

        const diseaseData = await getChronicDiseases(
          patient.patient_id,
          token
        );
        setDiseases(diseaseData);
      } catch (error) {
        console.error('Profile fetch error:', error.response?.data || error.message);
        Alert.alert('Error', 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // ✅ Handle Edit
  const handleEdit = () => {
    setTempProfile(profile);
    setIsEditing(true);
  };

  // ✅ Handle Cancel
  const handleCancel = () => {
    setIsEditing(false);
  };

  // ✅ Handle Save
  const handleSave = async () => {
    setSaving(true);
    try {
      const { token, patient } = await getSession();

      const updatedData = {
        name: tempProfile.fullName,
        email: tempProfile.email,
        phone: tempProfile.phone,
        address: tempProfile.address,
        dob: convertAgeToDOB(tempProfile.age),
      };

      const response = await axios.put(
        `http://10.195.21.165:5000/api/patients/${patient.patient_id}`,
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProfile({
        fullName: response.data.name,
        email: response.data.email,
        phone: response.data.phone,
        address: response.data.address,
        age: calculateAge(response.data.dob),
      });

      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Profile update error:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  // ✅ Add Chronic Disease
  const handleAddDisease = async () => {
    try {
      const { token, patient } = await getSession();
      const saved = await addChronicDisease(
        patient.patient_id,
        token,
        newDisease
      );
      setDiseases([saved, ...diseases]);
      setNewDisease({ disease_name: '', description: '', diagnosed_date: '' });
      setShowDiseaseForm(false);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Could not save disease.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Patient Profile Details</Text>

      {!isEditing ? (
        // ✅ View Mode
        <View>
         
          <Text style={styles.value}>{profile.fullName}</Text>

        
          <Text style={styles.value}>{profile.email}</Text>

          
          <Text style={styles.value}>{profile.phone}</Text>

          
          <Text style={styles.value}>{profile.address}</Text>

          
          <Text style={styles.value}>{profile.age}</Text>

          <TouchableOpacity style={styles.button} onPress={handleEdit}>
            <Text style={styles.buttonText}>Manage</Text>
          </TouchableOpacity>
          <Text style={styles.title}>CareGiver Registration</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('CaregiverRegister')}
          >
            <Text style={styles.buttonText}>Register Caregiver</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('CaregiverList')}
          >
            <Text style={styles.buttonText}>View Caregivers</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Chronic Diseases</Text>
          {diseases.length === 0 ? (
            <Text>No chronic diseases added yet.</Text>
          ) : (
            diseases.map((d, i) => (
              <View key={i} style={styles.infoBox}>
                <Text style={styles.value}>{d.disease_name}</Text>
                <Text>{d.description}</Text>
                <Text>Diagnosed: {d.diagnosed_date}</Text>
              </View>
            ))
          )}

          {/* Toggle button */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => setShowDiseaseForm(!showDiseaseForm)}
          >
            <Text style={styles.buttonText}>
              {showDiseaseForm ? 'Cancel' : 'Add Chronic Disease'}
            </Text>
          </TouchableOpacity>

          {/* ✅ Disease Form */}
          {showDiseaseForm && (
            <View style={styles.formBox}>
              <TextInput
                style={styles.input}
                placeholder="Disease Name"
                value={newDisease.disease_name}
                onChangeText={(text) =>
                  setNewDisease({ ...newDisease, disease_name: text })
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Description"
                value={newDisease.description}
                onChangeText={(text) =>
                  setNewDisease({ ...newDisease, description: text })
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Diagnosed Date (YYYY-MM-DD)"
                value={newDisease.diagnosed_date}
                onChangeText={(text) =>
                  setNewDisease({ ...newDisease, diagnosed_date: text })
                }
              />
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleAddDisease}
              >
                <Text style={styles.buttonText}>Save Disease</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ) : (
        // ✅ Edit Mode
        <View>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={tempProfile.fullName}
            onChangeText={(text) =>
              setTempProfile({ ...tempProfile, fullName: text })
            }
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={tempProfile.email}
            onChangeText={(text) =>
              setTempProfile({ ...tempProfile, email: text })
            }
          />

          <Text style={styles.label}>Phone</Text>
          <TextInput
            style={styles.input}
            value={tempProfile.phone}
            onChangeText={(text) =>
              setTempProfile({ ...tempProfile, phone: text })
            }
          />

          <Text style={styles.label}>Address</Text>
          <TextInput
            style={styles.input}
            value={tempProfile.address}
            onChangeText={(text) =>
              setTempProfile({ ...tempProfile, address: text })
            }
          />

          <Text style={styles.label}>Age</Text>
          <TextInput
            style={styles.input}
            value={tempProfile.age}
            keyboardType="numeric"
            onChangeText={(text) =>
              setTempProfile({ ...tempProfile, age: text })
            }
          />

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
              disabled={saving}
            >
              <Text style={styles.buttonText}>
                {saving ? 'Saving...' : 'Save'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8fffe',
    flexGrow: 1,
  },
   title: {
    fontSize: 32,
    fontWeight: '700',
    marginVertical: 20,
    textAlign: 'center',
    color: '#1a365d',
    letterSpacing: 0.5,
    textDecorationLine: 'underline',
  },
  label: {
    fontSize: 14,
    color: '#4a6741',
    marginTop: 15,
    marginBottom: 5,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2d3748',
    marginBottom: 15,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#48bb78',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  input: {
    borderWidth: 2,
    borderColor: '#cbd5e0',
    borderRadius: 10,
    padding: 14,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#ffffff',
    color: '#2d3748',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  button: {
    backgroundColor: '#48bb78',
    padding: 16,
    borderRadius: 12,
    marginTop: 15,
    shadowColor: '#48bb78',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  buttonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
    gap: 15,
  },
  saveButton: {
    backgroundColor: '#4299e1',
    padding: 16,
    borderRadius: 12,
    flex: 1,
    marginRight: 5,
    shadowColor: '#4299e1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  cancelButton: {
    backgroundColor: '#e53e3e',
    padding: 16,
    borderRadius: 12,
    flex: 1,
    marginLeft: 5,
    shadowColor: '#e53e3e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  formBox: {
    marginTop: 25,
    padding: 20,
    borderWidth: 0,
    borderRadius: 15,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  infoBox: {
    padding: 16,
    marginVertical: 8,
    borderWidth: 0,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    borderLeftWidth: 5,
    borderLeftColor: '#ed8936',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fffe',
  },
});
export default ProfileScreen;
