import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { getLabNotifications, updateNotificationStatus } from "../services/api";

const LabNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await getLabNotifications();
      const data = Array.isArray(response.data) ? response.data : response;
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      Alert.alert("Error", "Failed to fetch lab notifications");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  };

  const updateStatus = async (notificationId, newStatus) => {
    try {
      await updateNotificationStatus(notificationId, { status: newStatus });
      
      // Update local state
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, status: newStatus, updated_at: new Date().toISOString() }
            : notif
        )
      );
      
      Alert.alert("Success", `Notification marked as ${newStatus.toLowerCase()}`);
    } catch (error) {
      console.error("Error updating status:", error);
      Alert.alert("Error", "Failed to update notification status");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return '#ff9800';
      case 'PROCESSED':
        return '#2196f3';
      case 'COMPLETED':
        return '#4caf50';
      default:
        return '#757575';
    }
  };

  const getStatusActions = (notification) => {
    const { status, id } = notification;
    const actions = [];

    if (status === 'PENDING') {
      actions.push({
        label: 'Mark as Processed',
        onPress: () => updateStatus(id, 'PROCESSED'),
        color: '#2196f3',
      });
    }

    if (status === 'PROCESSED') {
      actions.push({
        label: 'Mark as Completed',
        onPress: () => updateStatus(id, 'COMPLETED'),
        color: '#4caf50',
      });
    }

    return actions;
  };

  const renderNotificationItem = ({ item }) => {
    const actions = getStatusActions(item);

    return (
      <View style={styles.notificationCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>

        <View style={styles.reportDetails}>
          <Text style={styles.reportTitle}>Report: {item.report_title}</Text>
          <Text style={styles.patientInfo}>
            Patient: {item.patient_name} ({item.patient_email})
          </Text>
          <Text style={styles.doctorInfo}>
            Doctor: Dr. {item.doctor_name} ({item.doctor_email})
          </Text>
        </View>

        <View style={styles.reportContent}>
          <Text style={styles.sectionLabel}>Description:</Text>
          <Text style={styles.description}>{item.description}</Text>
          
          <Text style={styles.sectionLabel}>Results:</Text>
          <Text style={styles.results}>{item.result}</Text>
        </View>

        <View style={styles.timestamps}>
          <Text style={styles.timestamp}>
            Created: {new Date(item.created_at).toLocaleString()}
          </Text>
          {item.updated_at && item.updated_at !== item.created_at && (
            <Text style={styles.timestamp}>
              Updated: {new Date(item.updated_at).toLocaleString()}
            </Text>
          )}
        </View>

        {actions.length > 0 && (
          <View style={styles.actionButtons}>
            {actions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.actionButton, { backgroundColor: action.color }]}
                onPress={action.onPress}
              >
                <Text style={styles.actionButtonText}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  const getPendingCount = () => {
    return notifications.filter(n => n.status === 'PENDING').length;
  };

  const getProcessedCount = () => {
    return notifications.filter(n => n.status === 'PROCESSED').length;
  };

  const getCompletedCount = () => {
    return notifications.filter(n => n.status === 'COMPLETED').length;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Lab Notifications</Text>
        <Text style={styles.totalCount}>Total: {notifications.length}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { borderLeftColor: '#ff9800' }]}>
          <Text style={styles.statNumber}>{getPendingCount()}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={[styles.statCard, { borderLeftColor: '#2196f3' }]}>
          <Text style={styles.statNumber}>{getProcessedCount()}</Text>
          <Text style={styles.statLabel}>Processed</Text>
        </View>
        <View style={[styles.statCard, { borderLeftColor: '#4caf50' }]}>
          <Text style={styles.statNumber}>{getCompletedCount()}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
      </View>

      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No lab notifications</Text>
          <Text style={styles.emptySubtext}>
            New reports will appear here when uploaded by patients or doctors
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderNotificationItem}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  totalCount: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  statsContainer: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
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
  notificationCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  reportDetails: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
  },
  reportTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  patientInfo: {
    fontSize: 13,
    color: "#007AFF",
    marginBottom: 2,
  },
  doctorInfo: {
    fontSize: 13,
    color: "#28a745",
  },
  reportContent: {
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    marginTop: 8,
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },
  results: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },
  timestamps: {
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 8,
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 11,
    color: "#999",
    marginBottom: 2,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
});

export default LabNotifications;