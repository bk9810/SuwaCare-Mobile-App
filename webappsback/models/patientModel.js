const pool = require("../config/db");

async function getAllPatients(){
    const result = await pool.query("SELECT * FROM patients");
    return result.rows;
}

module.exports = {
    getAllPatients
};