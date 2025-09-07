const pool = require("../config/db"); // DB connection (pg pool)

const Pharmacy = {
  // ➕ Add new pharmacy
  async addPharmacy(pharmacyData) {
    const {
      pharmacyName,
      licenseNumber,
      ownerName,
      phone,
      email,
      address,
      openingHours,
      closingHours,
      username,
      password,
    } = pharmacyData;

    const query = `
      INSERT INTO pharmacies 
      (pharmacy_name, license_number, owner_name, phone, email, address, opening_hours, closing_hours, username, password) 
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *;
    `;

    const values = [
      pharmacyName,
      licenseNumber,
      ownerName,
      phone,
      email,
      address,
      openingHours,
      closingHours,
      username,
      password, // ⚠️ later hash this with bcrypt
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // 🔍 Find pharmacy by username
  async findByUsername(username) {
    const query = `SELECT * FROM pharmacies WHERE username = $1`;
    const result = await pool.query(query, [username]);
    return result.rows[0];
  },

  // 🔍 Find pharmacy by email
  async findByEmail(email) {
    const query = `SELECT * FROM pharmacies WHERE email = $1`;
    const result = await pool.query(query, [email]);
    return result.rows[0];
  },
};

module.exports = Pharmacy;
