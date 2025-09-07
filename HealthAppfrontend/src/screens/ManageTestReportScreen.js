import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  Modal,
} from "react-native";
import { getReportsByDoctor, addReport, getPatientsByDoctor } from "../services/api";

const DoctorReports = ({ doctorId }) => {
  const [reports, setReports] = useState([]);
  const [assignedPatients, setAssignedPatients] = useState([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [form, setForm] = useState({
    patient_id: "",
    title: "",
    description: "",
    result: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReports();
    fetchAssignedPatients();
  }, [doctorId]);

  const fetchReports = async () => {
    try {
      const response = await getReportsByDoctor(doctorId);
      const data = Array.isArray(response.data) ? response.data : response;
      setReports(data);
    } catch (error) {
      console.error("Error fetching reports:", error);
      Alert.alert("Error", "Failed to fetch reports");
    }
  };

  const fetchAssignedPatients = async () => {
    try {
      const data = await getPatientsByDoctor(doctorId);
      setAssignedPatients(data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await addReport({
        ...form,
        doctor_id: doctorId,
        uploaded_by: "doctor",
      });

      // Reset form and close modal
      setForm({
        patient_id: "",
        title: "",
        description: "",
        result: "",
      });
      setShowUploadForm(false);
      
      // Refresh reports
      await fetchReports();
      
      Alert.alert("Success", "Report uploaded successfully and lab has been notified!");
    } catch (error) {
      console.error("Upload error:", error);
      Alert.alert("Error", "Failed to upload report");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return (
      form.patient_id.trim() &&
      form.title.trim() &&
      form.description.trim() &&
      form.result.trim()
    );
  };

  const getPatientName = (patientId) => {
    const patient = assignedPatients.find(p => p.patient_id == patientId);
    return patient ? patient.name : `Patient ${patientId}`;
  };

  const renderPatientPicker = () => (
    <View style={styles.patientPicker}>
      <Text style={styles.label}>Select Patient:</Text>
      <ScrollView style={styles.patientList}>
        {assignedPatients.map((patient) => (
          <TouchableOpacity
            key={patient.patient_id}
            style={[
              styles.patientOption,
              form.patient_id === patient.patient_id && styles.selectedPatient
            ]}
            onPress={() => setForm({ ...form, patient_id: patient.patient_id })}
          >
            <Text style={[
              styles.patientName,
              form.patient_id === patient.patient_id && styles.selectedPatientText
            ]}>
              {patient.name}
            </Text>
            <Text style={styles.patientEmail}>{patient.email}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Patient Reports</Text>
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={() => setShowUploadForm(true)}
        >
          <Text style={styles.uploadButtonText}>+ Add Report</Text>
        </TouchableOpacity>
      </View>

      {/* Report List */}
      {reports.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.noReportsText}>No reports found</Text>
          <Text style={styles.emptySubtext}>
            Upload your first patient report to get started
          </Text>
        </View>
      ) : (
        <View style={styles.reportsList}>
          {reports.map((r) => (
            <View key={r.report_id} style={styles.reportItem}>
              <View style={styles.reportHeader}>
                <Text style={styles.reportTitle}>{r.title}</Text>
                <View style={[
                  styles.uploadedByBadge, 
                  r.uploaded_by === 'doctor' ? styles.doctorBadge : styles.patientBadge
                ]}>
                  <Text style={styles.badgeText}>
                    {r.uploaded_by === 'doctor' ? 'You' : 'Patient'}
                  </Text>
                </View>
              </View>
              <Text style={styles.patientInfo}>
                Patient: {getPatientName(r.patient_id)}
              </Text>
              <Text style={styles.reportDescription}>{r.description}</Text>
              <View style={styles.resultContainer}>
                <Text style={styles.resultLabel}>Result: </Text>
                <Text style={styles.resultText}>{r.result}</Text>
              </View>
              <Text style={styles.metaText}>
                Uploaded: {new Date(r.created_at).toLocaleString()}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Upload Form Modal */}
      <Modal
        visible={showUploadForm}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Upload Patient Report</Text>
            <TouchableOpacity
              onPress={() => setShowUploadForm(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {assignedPatients.length > 0 ? (
              <>
                {renderPatientPicker()}

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Report Title</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., Lab Results Analysis"
                    value={form.title}
                    onChangeText={(text) => setForm({ ...form, title: text })}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Description</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Describe the report and analysis..."
                    value={form.description}
                    onChangeText={(text) => setForm({ ...form, description: text })}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Medical Results/Findings</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Enter medical findings and recommendations..."
                    value={form.result}
                    onChangeText={(text) => setForm({ ...form, result: text })}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>

                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    (!isFormValid() || loading) && styles.submitButtonDisabled,
                  ]}
                  onPress={handleSubmit}
                  disabled={!isFormValid() || loading}
                >
                  <Text style={styles.submitButtonText}>
                    {loading ? "Uploading..." : "Upload Report"}
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <View style={styles.noPatientsContainer}>
                <Text style={styles.noPatientsText}>No patients assigned</Text>
                <Text style={styles.noPatientsSubtext}>
                  You need to have assigned patients before uploading reports
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  uploadButton: {
    backgroundColor: "#28a745",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  uploadButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    marginTop: 100,
  },
  noReportsText: {
    textAlign: "center",
    color: "#666",
    fontSize: 18,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
  reportsList: {
    padding: 16,
    paddingBottom: 100,
  },
  reportItem: {
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  reportHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
    marginRight: 8,
  },
  uploadedByBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  doctorBadge: {
    backgroundColor: "#d4edda",
  },
  patientBadge: {
    backgroundColor: "#e3f2fd",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
  },
  patientInfo: {
    fontSize: 14,
    fontWeight: "600",
    color: "#007AFF",
    marginBottom: 8,
  },
  reportDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    lineHeight: 20,
  },
  resultContainer: {
    marginBottom: 8,
  },
  resultLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  resultText: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
    lineHeight: 20,
  },
  metaText: {
    fontSize: 12,
    color: "#9ca3af",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 18,
    color: "#666",
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  patientPicker: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  patientList: {
    maxHeight: 150,
  },
  patientOption: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedPatient: {
    borderColor: "#28a745",
    backgroundColor: "#f8fff9",
  },
  patientName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  selectedPatientText: {
    color: "#28a745",
  },
  patientEmail: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  formGroup: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  textArea: {
    minHeight: 80,
  },
  submitButton: {
    backgroundColor: "#28a745",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: "#ccc",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  noPatientsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  noPatientsText: {
    fontSize: 18,
    color: "#666",
    marginBottom: 8,
  },
  noPatientsSubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
});

export default DoctorReports;