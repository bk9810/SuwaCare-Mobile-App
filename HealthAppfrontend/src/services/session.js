// services/session.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@token';
const PATIENT_KEY = '@patient';
const DOCTOR_KEY = '@doctor';

// Patient session functions (existing)
export const setSession = async ({ token, patient }) => {
  await AsyncStorage.multiSet([
    [TOKEN_KEY, token || ''],
    [PATIENT_KEY, JSON.stringify(patient || {})],
  ]);
};

export const getSession = async () => {
  const [[, token], [, patientStr]] = await AsyncStorage.multiGet([
    TOKEN_KEY,
    PATIENT_KEY,
  ]);
  return {
    token: token || null,
    patient: patientStr ? JSON.parse(patientStr) : null,
  };
};

export const clearSession = async () => {
  await AsyncStorage.multiRemove([TOKEN_KEY, PATIENT_KEY]);
};

// Doctor session functions (new)
export const setDoctorSession = async ({ token, doctor }) => {
  await AsyncStorage.multiSet([
    [TOKEN_KEY, token || ''],
    [DOCTOR_KEY, JSON.stringify(doctor || {})],
  ]);
  // Clear patient data when doctor logs in
  await AsyncStorage.removeItem(PATIENT_KEY);
};

export const getDoctorSession = async () => {
  const [[, token], [, doctorStr]] = await AsyncStorage.multiGet([
    TOKEN_KEY,
    DOCTOR_KEY,
  ]);
  
  const doctor = doctorStr ? JSON.parse(doctorStr) : null;
  
  return {
    token: token || null,
    doctor: doctor,
    doctor_id: doctor?.doctor_id || null, // For backward compatibility
  };
};

export const clearDoctorSession = async () => {
  await AsyncStorage.multiRemove([TOKEN_KEY, DOCTOR_KEY]);
};

// Universal session functions
export const clearAllSessions = async () => {
  await AsyncStorage.multiRemove([TOKEN_KEY, PATIENT_KEY, DOCTOR_KEY]);
};

// Check what type of user is logged in
export const getCurrentUserType = async () => {
  const [[, token], [, patientStr], [, doctorStr]] = await AsyncStorage.multiGet([
    TOKEN_KEY,
    PATIENT_KEY,
    DOCTOR_KEY,
  ]);
  
  if (!token) return null;
  
  if (doctorStr && JSON.parse(doctorStr)) return 'doctor';
  if (patientStr && JSON.parse(patientStr)) return 'patient';
  
  return null;
};

// Get current session regardless of user type
export const getCurrentSession = async () => {
  const userType = await getCurrentUserType();
  
  if (userType === 'doctor') {
    return { ...(await getDoctorSession()), userType: 'doctor' };
  } else if (userType === 'patient') {
    return { ...(await getSession()), userType: 'patient' };
  }
  
  return { token: null, userType: null };
};