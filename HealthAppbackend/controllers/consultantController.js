const Consultant = require("../models/consultantModel");
const { google } = require("googleapis");

// Google API setup (OAuth2)
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);
oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

const calendar = google.calendar({ version: "v3", auth: oauth2Client });

const consultantController = {
  // Patient creates request
  async createRequest(req, res) {
    try {
      const { patient_id, doctor_id, reason, preferred_datetime } = req.body;

      if (!patient_id || !doctor_id || !reason || !preferred_datetime) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const request = await Consultant.createConsultantRequest({
        patient_id,
        doctor_id,
        reason,
        preferred_datetime
      });

      res.status(201).json({ message: "Consultation request created", request });
    } catch (err) {
      console.error("Create Request Error:", err.message);
      res.status(500).json({ error: err.message });
    }
  },

  // Doctor views all requests
  async getRequestsForDoctor(req, res) {
    try {
      const doctor_id = req.params.doctor_id;
      const requests = await Consultant.getConsultantsByDoctor(doctor_id);
      res.json(requests);
    } catch (err) {
      console.error("Get Requests Error:", err.message);
      res.status(500).json({ error: err.message });
    }
  },

  // Patient views their requests
  async getRequestsForPatient(req, res) {
    try {
      const patient_id = req.params.patient_id;
      const requests = await Consultant.getConsultantsByPatient(patient_id);
      res.json(requests);
    } catch (err) {
      console.error("Get Patient Requests Error:", err.message);
      res.status(500).json({ error: err.message });
    }
  },

  // Doctor accepts request & creates Google Meet link
// Doctor accepts request & creates Google Meet link
async acceptRequest(req, res) {
  try {
    const { consultant_id } = req.params;
    const { start_time, end_time, summary, description } = req.body;

    // Convert to RFC3339
    const formatToRFC3339 = (dt) => {
      // incoming: "2024-12-01 14:30"
      return new Date(dt.replace(" ", "T") + ":00+05:30").toISOString();
    };

    const event = {
      summary: summary || "Medical Consultation",
      description: description || "Online medical consultation",
      start: { dateTime: formatToRFC3339(start_time), timeZone: "Asia/Colombo" },
      end: { dateTime: formatToRFC3339(end_time), timeZone: "Asia/Colombo" },
      conferenceData: {
        createRequest: { requestId: `meet-${consultant_id}` }
      }
    };

    const response = await calendar.events.insert({
      calendarId: "primary",
      resource: event,
      conferenceDataVersion: 1
    });

    const meetingLink = response.data.hangoutLink;

    const updated = await Consultant.updateConsultantStatus(
      consultant_id,
      "ACCEPTED",
      meetingLink
    );

    res.json({ message: "Request accepted", consultation: updated });
  } catch (err) {
    console.error("Accept Request Error:", err.message, err.stack);
    res.status(500).json({ error: err.message });
  }
},

  // Doctor rejects request
  async rejectRequest(req, res) {
    try {
      const { consultant_id } = req.params;
      const updated = await Consultant.updateConsultantStatus(consultant_id, "REJECTED");
      res.json({ message: "Request rejected", consultation: updated });
    } catch (err) {
      console.error("Reject Request Error:", err.message);
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = consultantController;
