import '../css/appointments.css';
import { useEffect, useState } from 'react';
import axios from "axios";

export default function AppointmentsDetails() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/appointments")
      .then((response) =>{
        setAppointments(response.data);
      })
      .catch((err) => {
        console.error("Failed to load appointments:", err);
      });
  }, []);

  return (
     <div className="patient-details">
      <h2 className="text-2xl font-bold mb-4">Check Appointment Details</h2>
      <table className="patient-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>patientID</th>
            <th>doctorID</th>
            <th>Department</th>
            <th>Reason</th>
            <th>ScheduledAt</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((doc) => (
            <tr key={doc.appointment_id}>
              <td>{doc.appointment_id}</td>
              <td>{doc.patient_id}</td>
              <td>{doc.doctor_id}</td>
              <td>{doc.department}</td>
              <td>{doc.reason}</td>
              <td>{doc.scheduled_at}</td>
              <td>{doc.address}</td>
              <td>{doc.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
