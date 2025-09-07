import { useState } from "react";
import '../css/PharmacyRegistration.css'

export default function PharmacyRegistration() {
  const [formData, setFormData] = useState({
  pharmacyName: "",
  licenseNumber: "",
  ownerName: "",
  phone: "",
  email: "",
  address: "",
  openingHours: "",
  closingHours: "",
  username: "",
  password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 🔹 Updated handleSubmit with backend API call
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/pharmacies/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Pharmacy registered successfully!");
        // Reset form after success
        setFormData({
          pharmacyName: "",
  licenseNumber: "",
  ownerName: "",
  phone: "",
  email: "",
  address: "",
  openingHours: "",
  closingHours: "",
  username: "",
  password: "",
        });
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      alert("Server error: " + error.message);
    }
  };

  return (
    <div className="form-container">
      <h2>Register New Pharmacy</h2>
      <form onSubmit={handleSubmit}>
        <label>Pharmacy Name</label>
        <input type="text" name="pharmacyName" value={formData.pharmacyName} onChange={handleChange} required />

        <label>License Number</label>
        <input type="text" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} required />

        <label>Owner/Pharmacist Name</label>
        <input type="text" name="ownerName" value={formData.ownerName} onChange={handleChange} required />

        <label>Phone</label>
        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />

        <label>Email</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />


        <label>Username</label>
<input type="text" name="username" value={formData.username} onChange={handleChange} required />

<label>Password</label>
<input type="password" name="password" value={formData.password} onChange={handleChange} required />

        <label>Address</label>
        <textarea name="address" value={formData.address} onChange={handleChange}></textarea>

        <label>Opening Hours</label>
        <input type="time" name="openingHours" value={formData.openingHours} onChange={handleChange} />

        <label>Closing Hours</label>
        <input type="time" name="closingHours" value={formData.closingHours} onChange={handleChange} />

        <button type="submit">Add Pharmacy</button>
      </form>
    </div>
  );
}
