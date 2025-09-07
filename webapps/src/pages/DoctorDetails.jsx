import { useEffect, useState } from "react";
import axios from "axios"; // ✅ Import Axios
import "../css/DoctorDetails.css";

export default function DoctorDetails() {
  const [doctors, setDoctors] = useState([]);

  // Fetch doctors with axios
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/doctors")
      .then((response) => {
        setDoctors(response.data); // ✅ Axios auto-parses JSON
      })
      .catch((err) => {
        console.error("Failed to load doctors:", err);
      });
  }, []);

  // Update doctor status with axios
  const updateStatus = async (id, status) => {
    try {
      const res = await axios.put(
        `http://localhost:3000/api/doctors/${id}/status`,
        { status } // ✅ Axios automatically sets Content-Type to JSON
      );

      const updatedDoctor = res.data;

      // Update state
      setDoctors((prev) =>
        prev.map((doc) =>
          Number(doc.doctor_id) === Number(updatedDoctor.doctor_id)
            ? updatedDoctor
            : doc
        )
      );
    } catch (err) {
      console.error("Update failed:", err.response?.data || err.message);
    }
  };

  return (
    <div className="doctor-details">
      <h2 className="text-2xl font-bold mb-4">Doctor Management</h2>
      <table className="doctor-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Specialization</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((doc) => (
            <tr key={doc.doctor_id}>
              <td>{doc.doctor_id}</td>
              <td>{doc.name}</td>
              <td>{doc.email}</td>
              <td>{doc.specialization}</td>
              <td>{doc.status}</td>
              <td>
                {doc.status === "PENDING" && (
                  <>
                    <button
                      className="btn-approve"
                      onClick={() => updateStatus(doc.doctor_id, "APPROVED")}
                    >
                      Approve
                    </button>
                    <button
                      className="btn-reject"
                      onClick={() => updateStatus(doc.doctor_id, "REJECTED")}
                    >
                      Reject
                    </button>
                  </>
                )}
                {doc.status !== "PENDING" && <span>{doc.status}</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
