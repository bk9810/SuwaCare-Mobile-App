import '../css/PatientDetails.css';
import { useEffect, useState } from 'react';
import axios from "axios";

export default function PatientDetails() {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/patients")
      .then((response) =>{
        setPatients(response.data);
      })
      .catch((err) => {
        console.error("Failed to load patients:", err);
      });
  }, []);

  return (
     <div className="patient-details">
      <h2 className="text-2xl font-bold mb-4">Patient Management</h2>
      <table className="patient-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>DOB</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((doc) => (
            <tr key={doc.patient_id}>
              <td>{doc.patient_id}</td>
              <td>{doc.name}</td>
              <td>{doc.email}</td>
              <td>{doc.phone}</td>
              <td>{doc.address}</td>
              <td>{doc.dob}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
