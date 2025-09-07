import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { View } from 'react-native';
import i18n from "./src/i18n";


// Patient Screens
import WelcomeScreen from './src/screens/WelcomeScreen';
import FirstScreen from './src/screens/FirstScreen';
import LanguageSelectionScreen from './src/screens/LanguageSelectionScreen';
import RoleSelectionScreen from './src/screens/RoleSelectionScreen';
import PatientRegistrationScreen from './src/screens/PatientRegistrationScreen';
import PatientLoginScreen from './src/screens/PatientLoginScreen';
import PatientDashboardScreen from './src/screens/PatientDashboardScreen';
import MedicalInfoScreen from './src/screens/MedicalInfoScreen';
import PrescriptionScreen from './src/screens/PrescriptionScreen';
import TestReportScreen from './src/screens/TestReportScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import MedicalConsultationsScreen from './src/screens/MedicalConsultations';
import BookAppointmentScreen from './src/screens/BookAppointmentScreen';
import MyAppointmentsScreen from './src/screens/MyAppointmentsScreen';
import PatientMedicinesScreen from './src/screens/PatientMedicinesScreen';
import MyPrescriptionsScreen from './src/screens/MyPrescriptionsScreen';
import PrescriptionDetailsScreen from './src/screens/PrescriptionDetailsScreen';
import CreateConsultationRequestScreen from './src/screens/CreateConsultationRequestScreen';
import PatientConsultationsScreen from './src/screens/PatientConsultationsScreen';


// Caregiver Screens
import CaregiverRegister from './src/screens/CaregiverRegisterScreen';
import CaregiverList from './src/screens/CaregiverListScreen';

// Doctor Screens
import DoctorRegistrationScreen from './src/screens/DoctorRegisterScreen';
import DoctorLoginScreen from './src/screens/DoctorLoginScreen';
import DoctorDashboardScreen from './src/screens/DoctorDashboardScreen';
import ManageInfoScreen from './src/screens/ManageInfoScreen';
import ManagePrescriptionScreen from './src/screens/ManagePrescriptionScreen';
import ManageTestReportScreen from './src/screens/ManageTestReportScreen';
import DoctorProfileScreen from './src/screens/DoctorProfileScreen';
import DoctorAppointmentScreen from './src/screens/DoctorAppointmentScreen';
import DebugDoctors from './src/screens/DebugDoctors';
import AddMedicineScreen from './src/screens/AddMedicineScreen';
import CreatePrescriptionScreen from './src/screens/CreatePrescriptionScreen';
import DoctorPrescriptionsScreen from './src/screens/DoctorPrescriptionScreen';
import DoctorExtendedProfileScreen from './src/screens/DoctorExtendedProfileScreen';
import DoctorConsultationScreen from './src/screens/DoctorConsultationsScreen';
import ConsultationDetailsScreen from './src/screens/ConsultationDetailsScreen';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


/* -------------------- Patient Bottom Tabs -------------------- */
function PatientTabNavigator({ route }) {
  const { token, patient, selectedLanguage } = route.params || {};
  const patientId = patient?.id;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#667eea',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600', marginBottom: 8 },
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 0,
          elevation: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 20,
          height: 70,
          paddingBottom: 10,
          paddingTop: 5,
        },
        tabBarIcon: ({ focused }) => {
          let iconName;
          let iconColor = focused ? getColorForTab(route.name) : '#94a3b8';
          let iconSize = focused ? 26 : 24;

          switch (route.name) {
            case 'Home': iconName = focused ? 'home' : 'home-outline'; break;
            case 'Medical Info': iconName = focused ? 'pulse' : 'pulse-outline'; break;
            case 'Prescriptions': iconName = focused ? 'medical' : 'medical-outline'; break;
            case 'Test Reports': iconName = focused ? 'bar-chart' : 'bar-chart-outline'; break;
            case 'Profile': iconName = focused ? 'person-circle' : 'person-circle-outline'; break;
            default: iconName = 'ellipse-outline';
          }

          return (
            <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 8 }}>
              <Icon name={iconName} size={iconSize} color={iconColor} />
              {focused && <View style={{
                width: 4, height: 4, borderRadius: 2,
                backgroundColor: iconColor, marginTop: 4
              }} />}
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={PatientDashboardScreen} initialParams={{ token, patient, selectedLanguage }} />
      <Tab.Screen name="Medical Info" component={MedicalInfoScreen} />
      <Tab.Screen name="Prescriptions" component={MyPrescriptionsScreen} />
      <Tab.Screen name="Test Reports" component={TestReportScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} initialParams={{ token, patientId }} />
    </Tab.Navigator>
  );
}

const getColorForTab = (tabName) => {
  const colors = {
    'Home': '#667eea',
    'Medical Info': '#ef4444',
    'Prescriptions': '#10b981',
    'Test Reports': '#f59e0b',
    'Profile': '#8b5cf6',
  };
  return colors[tabName] || '#667eea';
};

/* -------------------- Doctor Bottom Tabs -------------------- */
function DoctorTabNavigator({ route }) {
  const { token, doctor, selectedLanguage } = route.params || {};
  const doctorId = doctor?.id;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: { backgroundColor: '#fff', height: 60 },
        tabBarIcon: ({ color }) => {
          let iconName;
          switch (route.name) {
            case 'Doc-Home': iconName = 'home-outline'; break;
            case 'Manage-Medical-Info': iconName = 'medkit-outline'; break;
            case 'Manage-Prescriptions': iconName = 'person-text-outline'; break;
            case 'Manage-Test-Reports': iconName = 'flask-outline'; break;
            case 'Profile': iconName = 'person-outline'; break;
            default: iconName = 'ellipse-outline';
          }
          return <Icon name={iconName} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Doc-Home" component={DoctorDashboardScreen} initialParams={{ token, doctor, selectedLanguage }} />
      <Tab.Screen name="Manage-Medical-Info" component={ManageInfoScreen} />
      <Tab.Screen name="Manage-Prescriptions" component={ManagePrescriptionScreen} />
      <Tab.Screen name="Manage-Test-Reports" component={ManageTestReportScreen} />
      <Tab.Screen name="Profile" component={DoctorProfileScreen} initialParams={{ token, doctorId }} />
    </Tab.Navigator>
  );
}

/* -------------------- Main App -------------------- */
export default function App() {
  return (
    
      <NavigationContainer>
      <Stack.Navigator initialRouteName="WelcomeScreen" screenOptions={{ headerShown: false }}>
        {/* Common Screens */}
        <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
        <Stack.Screen name="FirstScreen" component={FirstScreen} />
        <Stack.Screen name="LanguageSelection" component={LanguageSelectionScreen} />
        <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />

        {/* Patient Flow */}
        <Stack.Screen name="PatientRegistration" component={PatientRegistrationScreen} />
        <Stack.Screen name="PatientLogin" component={PatientLoginScreen} />
        <Stack.Screen name="PatientDashboard" component={PatientTabNavigator} />
        <Stack.Screen name="BookAppointment" component={BookAppointmentScreen} />
        <Stack.Screen name="MyAppointmentsScreen" component={MyAppointmentsScreen} />
        <Stack.Screen name="MedicalConsultations" component={MedicalConsultationsScreen} />
        <Stack.Screen name="PatientMedicines" component={PatientMedicinesScreen} />
        <Stack.Screen name="PrescriptionDetails" component={PrescriptionDetailsScreen} />
        <Stack.Screen name="MyPrescriptions" component={MyPrescriptionsScreen}/>
        <Stack.Screen name="CreateConsultationRequestScreen" component={CreateConsultationRequestScreen}/>
        <Stack.Screen name="PatientConsultationsScreen" component={PatientConsultationsScreen}/>

        {/* Caregiver Flow */}
        <Stack.Screen name="CaregiverRegister" component={CaregiverRegister} />
        <Stack.Screen name="CaregiverList" component={CaregiverList} />

        {/* Doctor Flow */}
        <Stack.Screen name="DoctorRegistration" component={DoctorRegistrationScreen} />
        <Stack.Screen name="DoctorLogin" component={DoctorLoginScreen} />
        <Stack.Screen name="DoctorDashboard" component={DoctorTabNavigator} />
        <Stack.Screen name="DoctorAppointment" component={DoctorAppointmentScreen} />
        <Stack.Screen name="BookAppointments" component={DebugDoctors} />
        <Stack.Screen name="AddMedicine" component={AddMedicineScreen} />
        <Stack.Screen name="CreatePrescription" component={CreatePrescriptionScreen} />
        <Stack.Screen name= "DoctorPrescriptions" component={DoctorPrescriptionsScreen}/>
        <Stack.Screen 
          name="DoctorExtendedProfileScreen" 
          component={DoctorExtendedProfileScreen}/>
      <Stack.Screen name= "DoctorConsultationScreen" component={DoctorConsultationScreen}/>
      <Stack.Screen name="ConsultationDetailsScreen" component={ConsultationDetailsScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
    
  );
}
