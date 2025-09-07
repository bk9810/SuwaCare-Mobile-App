import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomeScreen from './pages/WelcomeScreen';
import PharmacyLogin from "./pages/pharmacyLogin";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import DoctorDetails from "./pages/DoctorDetails";
import PatientDetails from "./pages/PatientDetails";
import PharmacyRegistration from "./pages/PharmacyRegistration";
import PharmacyDashboard from "./pages/PharmacyDashboard";
import AppointmentsDetails from "./pages/AppointmentsDetails";
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/pharmacy-login" element={<PharmacyLogin />} />
         <Route path="/pharmacy-dashboard" element={<PharmacyDashboard />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />}>
          <Route path="doctors" element={<DoctorDetails />} />
          <Route path="patients" element={<PatientDetails />} />
           <Route path="pharmacies" element={<PharmacyRegistration />} />
           <Route path="appointments" element={<AppointmentsDetails/>}/>
           
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
