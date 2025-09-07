import { useState, useEffect } from "react";
import { Pill, FileText, Users, LogOut, Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import "../css/PharmacyDashboard.css";

export default function PharmacyDashboard() {
  const [activeTab, setActiveTab] = useState("prescriptions");
  const [pharmacyId, setPharmacyId] = useState(null);

  const [prescriptions, setPrescriptions] = useState([
    {
      id: 1,
      patientName: "John Doe",
      doctorName: "Dr. Smith",
      medicines: ["Amoxicillin 500mg", "Paracetamol 500mg"],
      status: "Pending",
      date: "2025-01-15",
      total: "$45.50",
    },
    {
      id: 2,
      patientName: "Jane Wilson",
      doctorName: "Dr. Johnson",
      medicines: ["Ibuprofen 400mg", "Vitamin D3"],
      status: "Dispensed",
      date: "2025-01-14",
      total: "$32.00",
    },
  ]);

  const [medicines, setMedicines] = useState([
    {
      id: 1,
      name: "Amoxicillin 500mg",
      category: "Antibiotic",
      stock: 45,
      minStock: 20,
      price: "$12.50",
      expiryDate: "2025-12-15",
      supplier: "PharmaCorp",
    },
    {
      id: 2,
      name: "Paracetamol 500mg",
      category: "Pain Relief",
      stock: 120,
      minStock: 50,
      price: "$8.00",
      expiryDate: "2026-03-20",
      supplier: "MedSupply",
    },
    {
      id: 3,
      name: "Ibuprofen 400mg",
      category: "Anti-inflammatory",
      stock: 15,
      minStock: 25,
      price: "$15.00",
      expiryDate: "2025-09-10",
      supplier: "HealthDist",
    },
  ]);

  const [patients, setPatients] = useState([
    {
      id: 1,
      name: "John Doe",
      phone: "+1-234-567-8901",
      email: "john.doe@email.com",
      address: "123 Main St, City",
      lastVisit: "2025-01-15",
      totalPrescriptions: 12,
    },
    {
      id: 2,
      name: "Jane Wilson",
      phone: "+1-234-567-8902",
      email: "jane.wilson@email.com",
      address: "456 Oak Ave, City",
      lastVisit: "2025-01-14",
      totalPrescriptions: 8,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");

  useEffect(() => {
    const storedPharmacyId = "PHARM001";
    setPharmacyId(storedPharmacyId);
  }, []);

  const handleLogout = () => {
    alert("Logout functionality would redirect to login page");
  };

  const updatePrescriptionStatus = (id, newStatus) => {
    setPrescriptions((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );
  };

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType("");
  };

  const PrescriptionsPage = () => {
    const filteredPrescriptions = prescriptions.filter(
      (p) =>
        p.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.doctorName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="page">
        <div className="page-header">
          <h2>Prescriptions Management</h2>
          <div className="actions">
            <div className="search-box">
              <Search className="icon" />
              <input
                type="text"
                placeholder="Search prescriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button onClick={() => openModal("prescription")} className="btn-primary">
              <Plus size={16} /> Add Prescription
            </button>
          </div>
        </div>

        <div className="card-grid">
          {filteredPrescriptions.map((p) => (
            <div key={p.id} className="card">
              <div className="card-header">
                <div>
                  <h3>{p.patientName}</h3>
                  <p>Prescribed by: {p.doctorName}</p>
                  <span>Date: {p.date}</span>
                </div>
                <span className={`status ${p.status.toLowerCase()}`}>
                  {p.status === "Pending" ? "⏳ Pending" : "✅ Dispensed"}
                </span>
              </div>
              <div>
                <h4>Medicines:</h4>
                <ul>
                  {p.medicines.map((m, i) => (
                    <li key={i}>• {m}</li>
                  ))}
                </ul>
              </div>
              <div className="card-footer">
                <strong>{p.total}</strong>
                <div className="buttons">
                  <button className="btn-view">
                    <Eye size={14} />
                  </button>
                  <button className="btn-edit">
                    <Edit size={14} />
                  </button>
                  {p.status === "Pending" && (
                    <button
                      onClick={() => updatePrescriptionStatus(p.id, "Dispensed")}
                      className="btn-done"
                    >
                      Mark Dispensed
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const MedicineStockPage = () => {
    const filteredMedicines = medicines.filter(
      (m) =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="page">
        <div className="page-header">
          <h2>Medicine Stock Management</h2>
          <div className="actions">
            <div className="search-box">
              <Search className="icon" />
              <input
                type="text"
                placeholder="Search medicines..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button onClick={() => openModal("medicine")} className="btn-primary">
              <Plus size={16} /> Add Medicine
            </button>
          </div>
        </div>
        <div className="card-grid">
          {filteredMedicines.map((m) => (
            <div key={m.id} className="card">
              <h3>{m.name}</h3>
              <p>Category: {m.category}</p>
              <p>Supplier: {m.supplier}</p>
              <p>
                <strong>{m.price}</strong> per unit
              </p>
              <p>Stock: {m.stock} (Min: {m.minStock})</p>
              <p>Expiry: {m.expiryDate}</p>
              <p>Status: {m.stock < m.minStock ? "Low Stock" : "In Stock"}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const PatientDetailsPage = () => {
    const filteredPatients = patients.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="page">
        <div className="page-header">
          <h2>Patient Details</h2>
          <div className="actions">
            <div className="search-box">
              <Search className="icon" />
              <input
                type="text"
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button onClick={() => openModal("patient")} className="btn-primary">
              <Plus size={16} /> Add Patient
            </button>
          </div>
        </div>
        <div className="card-grid">
          {filteredPatients.map((p) => (
            <div key={p.id} className="card">
              <h3>{p.name}</h3>
              <p>{p.email}</p>
              <p>{p.phone}</p>
              <p>Address: {p.address}</p>
              <p>Last Visit: {p.lastVisit}</p>
              <p>Total Prescriptions: {p.totalPrescriptions}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const Modal = () => {
    if (!showModal) return null;
    return (
      <div className="modal-overlay">
        <div className="modal">
          <h3>Add New {modalType}</h3>
          <p>Form for adding new {modalType} would go here.</p>
          <div className="modal-actions">
            <button onClick={closeModal} className="btn">
              Cancel
            </button>
            <button onClick={closeModal} className="btn-primary">
              Save
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="nav-left">
          <Pill size={24} /> <h1>Pharmacy Dashboard</h1>
          {pharmacyId && <span>ID: {pharmacyId}</span>}
        </div>
        <div className="nav-right">
          <button onClick={handleLogout} className="btn-logout">
            <LogOut size={14} /> Logout
          </button>
        </div>
      </nav>

      <div className="tabs">
        <button
          onClick={() => setActiveTab("prescriptions")}
          className={activeTab === "prescriptions" ? "tab active" : "tab"}
        >
          <FileText size={16} /> Prescriptions
        </button>
        <button
          onClick={() => setActiveTab("stock")}
          className={activeTab === "stock" ? "tab active" : "tab"}
        >
          <Pill size={16} /> Medicine Stock
        </button>
        <button
          onClick={() => setActiveTab("patients")}
          className={activeTab === "patients" ? "tab active" : "tab"}
        >
          <Users size={16} /> Patient Details
        </button>
      </div>

      <main className="main">
        {activeTab === "prescriptions" && <PrescriptionsPage />}
        {activeTab === "stock" && <MedicineStockPage />}
        {activeTab === "patients" && <PatientDetailsPage />}
      </main>

      <Modal />
    </div>
  );
}
