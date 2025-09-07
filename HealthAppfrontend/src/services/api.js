import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Api.js
const BASE_URL = "http://10.195.21.165:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Add request interceptor to automatically add token and debug
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log('🔍 API Request Debug:', {
        url: config.url,
        method: config.method,
        hasToken: !!token,
        tokenPreview: token ? `${token.substring(0, 20)}...` : 'No token'
      });
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('❌ Token retrieval error:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to debug 401s
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Success:', response.config.url);
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.error('🚫 401 Unauthorized:', {
        url: error.config?.url,
        method: error.config?.method,
        message: error.response?.data?.message || 'Unauthorized'
      });
    }
    return Promise.reject(error);
  }
);

/* ---------------- All your existing functions stay the same ---------------- */
export const registerPatient = async (patientData) => {
  const { data } = await api.post("/patients/register", patientData);
  return data;
};

// ✅ Fixed Patient Login
export const loginPatient = async (loginData) => {
  const { data } = await api.post("/patients/login", loginData);

  if (data.token) {
    await AsyncStorage.setItem('token', data.token);
  }

  if (data.patient) {
    const patientData = {
      patient_id: data.patient.patient_id,
      name: data.patient.name,
      email: data.patient.email,
      type: 'patient'
    };
    await AsyncStorage.setItem('userData', JSON.stringify(patientData));
  }

  return data;
};

export const getPatientProfile = async (id, token) => {
  const { data } = await api.get(`/patients/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const updatePatientProfile = async (id, token, updates) => {
  const { data } = await api.put(`/patients/${id}`, updates, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const registerCaregiver = async (patientId, token, caregiverData) => {
  const { data } = await api.post(`/caregivers/${patientId}`, caregiverData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const getCaregivers = async (patientId, token) => {
  const { data } = await api.get(`/caregivers/${patientId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const updateCaregiver = async (id, token, caregiverData) => {
  const { data } = await api.put(`/caregivers/update/${id}`, caregiverData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const getChronicDiseases = async (patientId, token) => {
  const { data } = await api.get(`/chronic-diseases/${patientId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data || [];
};

export const addChronicDisease = async (patientId, token, diseaseData) => {
  const { data } = await api.post(`/chronic-diseases/${patientId}`, diseaseData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const updateChronicDisease = async (diseaseId, token, diseaseData) => {
  const { data } = await api.put(`/chronic-diseases/update/${diseaseId}`, diseaseData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const registerDoctor = async (doctorData) => {
  const { data } = await api.post("/doctors/register", doctorData);
  return data;
};

// ✅ Fixed Doctor Login
export const loginDoctor = async (loginData) => {
  const { data } = await api.post("/doctors/login", loginData);

  if (data.token) {
    await AsyncStorage.setItem('token', data.token);
  }

  if (data.doctor) {
    const doctorData = {
      doctor_id: data.doctor.doctor_id,
      name: data.doctor.name,
      email: data.doctor.email,
      specialization: data.doctor.specialization,
      status: data.doctor.status,
      type: 'doctor'
    };
    await AsyncStorage.setItem('userData', JSON.stringify(doctorData));
  }

  return data;
};

export const getDoctors = async (disease) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found. Please log in first.');
    }

    const path = disease 
      ? `/doctors?disease=${encodeURIComponent(disease)}`
      : "/doctors";

    const response = await api.get(path, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });

    const doctors = Array.isArray(response.data) ? response.data : [];
    const approvedDoctors = doctors.filter(doc => doc.status === 'APPROVED');
    return approvedDoctors;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error('Authentication failed. Please log in again.');
    } else if (error.response?.status === 403) {
      throw new Error('Access denied. Please check your permissions.');
    } else if (error.response?.status === 500) {
      throw new Error('Server error. Please try again later.');
    } else if (!error.response) {
      throw new Error('Network error. Please check your internet connection.');
    }
    throw error;
  }
};

export const getAllDoctors = async () => {
  const token = await AsyncStorage.getItem('token');
  if (!token) throw new Error('Please log in first.');

  const { data } = await api.get("/doctors/all", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const bookAppointment = async (appointmentData) => {
  const { data } = await api.post("/patient/appointments/book", appointmentData);
  return data;
};

export const getMyAppointments = async (patientId) => {
  const { data } = await api.get(`/patient/appointments/${patientId}`);
  return data;
};

export const getDoctorAppointments = async (doctorId) => {
  const { data } = await api.get(`/doctor/appointments/${doctorId}`);
  return data;
};

// Appointment status update
export const updateAppointmentStatus = async (appointmentId, updateData) => {
  let requestData = { status: updateData.status };
  
  if (updateData.status === 'ACCEPTED' && updateData.appointment_date && updateData.location) {
    requestData.appointment_date = updateData.appointment_date;
    requestData.location = updateData.location;
  } else if (updateData.status === 'REJECTED' && updateData.rejection_reason) {
    requestData.rejection_reason = updateData.rejection_reason;
  }
  
  const { data } = await api.put(`/doctor/appointments/${appointmentId}`, requestData);
  return data;
};

export const debugCurrentToken = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    console.log('🔍 Current Token Debug:', {
      hasToken: !!token,
      tokenLength: token?.length,
      tokenPreview: token ? `${token.substring(0, 30)}...` : 'No token stored'
    });
    return token;
  } catch (error) {
    console.error('❌ Error getting token:', error);
    return null;
  }
};

export const clearToken = async () => {
  try {
    await AsyncStorage.removeItem('token');
    console.log('🗑️ Token cleared');
  } catch (error) {
    console.error('❌ Error clearing token:', error);
  }
};

export const getPersonalizedTips = async (patientId) => {
  const { data } = await api.get(`/tips/${patientId}`);
  return data || { tips: [] };
};

// ----------------- Prescription endpoints -----------------
export const createPrescription = async (payload) => {
  const { data } = await api.post('/prescriptions', payload);
  return data;
};

export const getPrescriptionById = async (prescriptionId) => {
  const { data } = await api.get(`/prescriptions/${prescriptionId}`);
  return data;
};

export const getPrescriptionsByPatient = async (patientId) => {
  const { data } = await api.get(`/prescriptions/patient/${patientId}`);
  return data;
};

export const getPrescriptionsByDoctor = async (doctorId) => {
  const { data } = await api.get(`/prescriptions/doctor/${doctorId}`);
  return data;
};

export const addMedicineToPrescription = async (prescriptionId, medicineData) => {
  const { data } = await api.post(`/prescriptions/${prescriptionId}/medicines`, medicineData);
  return data;
};

export const getPrescriptionMedicines = async (prescriptionId) => {
  const { data } = await api.get(`/prescriptions/${prescriptionId}/medicines`);
  return data;
};

export const updateMedicine = async (medicineId, medicineData) => {
  const { data } = await api.put(`/prescriptions/medicines/${medicineId}`, medicineData);
  return data;
};


// ----------------- Doctor-Patient Assignment APIs -----------------

// ✅ Assign a doctor to a patient
export const assignDoctorToPatient = async (doctorId, patientId) => {
  const { data } = await api.post("/doctor-patient/assign", { doctorId, patientId });
  return data;
};

// ✅ Get all patients assigned to a doctor
export const getPatientsByDoctor = async (doctorId) => {
  const { data } = await api.get(`/doctor-patient/doctor/${doctorId}`);
  return data;
};

// ✅ Get all doctors assigned to a patient
export const getDoctorsByPatient = async (patientId) => {
  const { data } = await api.get(`/doctor-patient/patient/${patientId}`);
  return data;
};

// ✅ Remove doctor-patient assignment
export const removeDoctorPatientAssignment = async (assignmentId) => {
  const { data } = await api.delete(`/doctor-patient/${assignmentId}`);
  return data;
};

// ----------------- Test Report APIs (Updated) -----------------

// ✅ Add a test report (enhanced version)
export const addReport = async (reportData) => {
  const { data } = await api.post("/test-reports", reportData);
  return data;
};

// ✅ Get all test reports for a patient (updated to handle new response format)
export const getPatientReports = async (patientId) => {
  const { data } = await api.get(`/test-reports/patient/${patientId}`);
  return data;
};

// ✅ Get all test reports for a doctor (updated to handle new response format)
export const getReportsByDoctor = async (doctorId) => {
  const { data } = await api.get(`/test-reports/doctor/${doctorId}`);
  return data;
};

// ✅ Delete a test report
export const deleteTestReport = async (reportId) => {
  const { data } = await api.delete(`/test-reports/${reportId}`);
  return data;
};

// ----------------- Lab Notification APIs (New) -----------------

// ✅ Get all lab notifications
export const getLabNotifications = async () => {
  const { data } = await api.get("/test-reports/lab/notifications");
  return data;
};

// ✅ Update notification status
export const updateNotificationStatus = async (notificationId, updateData) => {
  const { data } = await api.put(`/test-reports/lab/notifications/${notificationId}`, updateData);
  return data;
};