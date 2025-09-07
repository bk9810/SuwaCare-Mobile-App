const pool = require("../config/db");

async function getAppointment() {
    const result =  await pool.query("SELECT * FROM appointments");
    return result.rows;
}

module.exports = {
    getAppointment
}