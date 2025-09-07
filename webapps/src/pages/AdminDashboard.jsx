import { Link, Outlet } from "react-router-dom";
import '../css/AdminDashboard.css'

export default function AdminDashboard() {
  return (
    <div className="dashboard-container">
      
      <div className="sidebar">
        <h2>Admin Dashboard</h2>
        <nav>
          <Link to="doctors">Doctor Details</Link>
          <Link to="patients">Patient Details</Link>
          <Link to="pharmacies">Pharmacy Registration</Link> 
          <Link to="appointments">Appointments Details</Link>
        </nav>
      </div>

      
      <div className="content">
        <Outlet /> 
      </div>
    </div>
  );
}
