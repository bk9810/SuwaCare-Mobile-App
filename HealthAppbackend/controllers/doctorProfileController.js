const DoctorProfile = require("../models/doctorProfileModel");

// Get Profile - Return empty profile if not found instead of 404
async function getProfile(req, res) {
    const doctor_id = req.params.id;
    try {
        const profile = await DoctorProfile.getDoctorProfile(doctor_id);
        
        // If no profile exists, return a default empty profile structure
        if (!profile) {
            console.log(`No profile found for doctor_id: ${doctor_id}, returning empty profile`);
            return res.json({
                doctor_id: parseInt(doctor_id),
                bio: '',
                sub_specialization: '',
                experience_years: null,
                qualifications: '',
                languages_spoken: []
            });
        }
        
        // Parse languages_spoken if it's a JSON string
        if (profile.languages_spoken && typeof profile.languages_spoken === 'string') {
            try {
                profile.languages_spoken = JSON.parse(profile.languages_spoken);
            } catch (e) {
                console.log("Error parsing languages_spoken, defaulting to empty array");
                profile.languages_spoken = [];
            }
        }
        
        res.json(profile);
    } catch (err) {
        console.error("Get Profile Error:", err.message);
        res.status(500).json({ error: err.message });
    }
}

// Update / Create Profile
async function updateProfile(req, res) {
    const doctor_id = req.params.id;
    const { bio, sub_specialization, experience_years, qualifications, languages_spoken } = req.body;

    try {
        const profile = await DoctorProfile.upsertDoctorProfile(doctor_id, { 
            bio, 
            sub_specialization, 
            experience_years, 
            qualifications, 
            languages_spoken 
        });
        
        // Parse languages_spoken in response if it's a JSON string
        if (profile.languages_spoken && typeof profile.languages_spoken === 'string') {
            try {
                profile.languages_spoken = JSON.parse(profile.languages_spoken);
            } catch (e) {
                profile.languages_spoken = [];
            }
        }
        
        res.json({ message: "Profile updated successfully", profile });
    } catch (err) {
        console.error("Update Profile Error:", err.message);
        res.status(500).json({ error: err.message });
    }
}

module.exports = { getProfile, updateProfile };