import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  Alert,
  ScrollView,
  Modal
} from "react-native";
import { getPatientReports, addReport, getDoctorsByPatient } from "../services/api";

const PatientReports = ({ patientId }) => {
  const [reports, setReports] = useState([]);
  const [assignedDoctors, setAssignedDoctors] = useState([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [form, setForm] = useState({
    doctor_id: "",
    title: "",
    description: "",
    result: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReports();
    fetchAssignedDoctors();
  }, [patientId]);

  const fetchReports = async () => {
    try {
      const response = await getPatientReports(patientId);
      const data = Array.isArray(response.data) ? response.data : response;
      setReports(data);
    } catch (err) {
      console.error("Error fetching reports:", err);
      Alert.alert("Error", "Failed to fetch reports");
    }
  };

  const fetchAssignedDoctors = async () => {
    try {
      const data = await getDoctorsByPatient(patientId);
      setAssignedDoctors(data);
    } catch (err) {
      console.error("Error fetching doctors:", err);
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
        patient_id: patientId,
        uploaded_by: "patient",
      });

      // Reset form and close modal
      setForm({
        doctor_id: "",
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
      form.doctor_id.trim() &&
      form.title.trim() &&
      form.description.trim() &&
      form.result.trim()
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.reportCard}>
      <View style={styles.reportHeader}>
        <Text style={styles.title}>{item.title}</Text>
        <View style={[
          styles.uploadedByBadge, 
          item.uploaded_by === 'patient' ? styles.patientBadge : styles.doctorBadge
        ]}>
          <Text style={styles.badgeText}>
            {item.uploaded_by === 'patient' ? 'You' : 'Doctor'}
          </Text>
        </View>
      </View>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.resultContainer}>
        <Text style={styles.bold}>Result: </Text>
        {item.result}
      </Text>
      <Text style={styles.date}>
        Uploaded: {new Date(item.created_at).toLocaleString()}
      </Text>
    </View>
  );

  const renderDoctorPicker = () => (
    <View style={styles.doctorPicker}>
      <Text style={styles.label}>Select Doctor:</Text>
      <ScrollView style={styles.doctorList}>
        {assignedDoctors.map((doctor) => (
          <TouchableOpacity
            key={doctor.doctor_id}
            style={[
              styles.doctorOption,
              form.doctor_id === doctor.doctor_id && styles.selectedDoctor
            ]}
            onPress={() => setForm({ ...form, doctor_id: doctor.doctor_id })}
          >
            <Text style={[
              styles.doctorName,
              form.doctor_id === doctor.doctor_id && styles.selectedDoctorText
            ]}>
              Dr. {doctor.name}
            </Text>
            <Text style={styles.doctorSpec}>{doctor.specialization}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Test Reports</Text>
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={() => setShowUploadForm(true)}
        >
          <Text style={styles.uploadButtonText}>+ Upload Report</Text>
        </TouchableOpacity>
      </View>

      {reports.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No reports available</Text>
          <Text style={styles.emptySubtext}>Upload your first lab report to get started</Text>
        </View>
      ) : (
        <FlatList
          data={reports}
          keyExtractor={(item) => item.report_id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Upload Form Modal */}
      <Modal
        visible={showUploadForm}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Upload Lab Report</Text>
            <TouchableOpacity
              onPress={() => setShowUploadForm(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {assignedDoctors.length > 0 ? (
              <>
                {renderDoctorPicker()}

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Report Title</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., Blood Test Results"
                    value={form.title}
                    onChangeText={(text) => setForm({ ...form, title: text })}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Description</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Describe the test and any relevant details..."
                    value={form.description}
                    onChangeText={(text) => setForm({ ...form, description: text })}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Test Results</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Enter the test results or findings..."
                    value={form.result}
                    onChangeText={(text) => setForm({ ...form, result: text })}
                    multiline
                    numberOfLines={3}
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
              <View style={styles.noDoctorsContainer}>
                <Text style={styles.noDoctorsText}>No doctors assigned</Text>
                <Text style={styles.noDoctorsSubtext}>
                  You need to be assigned to a doctor before uploading reports
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>
    </View>
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
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  uploadButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  uploadButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
  reportCard: {
    padding: 16,
    marginBottom: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  reportHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  title: {
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
  patientBadge: {
    backgroundColor: "#e3f2fd",
  },
  doctorBadge: {
    backgroundColor: "#f3e5f5",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    lineHeight: 20,
  },
  resultContainer: {
    marginBottom: 8,
  },
  bold: {
    fontWeight: "bold",
    color: "#333",
  },
  date: {
    fontSize: 12,
    color: "#999",
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
  doctorPicker: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  doctorList: {
    maxHeight: 120,
  },
  doctorOption: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedDoctor: {
    borderColor: "#007AFF",
    backgroundColor: "#f0f8ff",
  },
  doctorName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  selectedDoctorText: {
    color: "#007AFF",
  },
  doctorSpec: {
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
    backgroundColor: "#007AFF",
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
  noDoctorsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  noDoctorsText: {
    fontSize: 18,
    color: "#666",
    marginBottom: 8,
  },
  noDoctorsSubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
});

export default PatientReports;