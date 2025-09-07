// services/notificationService.js
const nodemailer = require('nodemailer');

// Configure email transporter (you'll need to set up your email service)
let transporter = null;

// Initialize transporter only if email credentials are provided
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    service: 'gmail', // or your email service
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
} else {
  console.warn('⚠️  Email credentials not configured. Email notifications will be disabled.');
}

const notifyLab = async (lab, report) => {
  try {
    if (!transporter) {
      console.log(`📧 Email notification skipped for lab ${lab.name} (credentials not configured)`);
      return { success: false, reason: 'Email not configured' };
    }

    // Email notification
    await sendEmailNotification({
      to: lab.email,
      subject: 'New Test Report Received',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
            New Test Report Received
          </h2>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">Report Details</h3>
            <p><strong>Report ID:</strong> ${report.report_id}</p>
            <p><strong>Title:</strong> ${report.title}</p>
            <p><strong>Patient ID:</strong> ${report.patient_id}</p>
            <p><strong>Doctor ID:</strong> ${report.doctor_id}</p>
            <p><strong>Uploaded by:</strong> ${report.uploaded_by}</p>
            <p><strong>Date:</strong> ${new Date(report.created_at).toLocaleString()}</p>
          </div>
          
          <div style="background-color: #eff6ff; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6;">
            <h4 style="color: #1e40af; margin-top: 0;">Description:</h4>
            <p style="color: #1f2937;">${report.description}</p>
          </div>
          
          <div style="background-color: #f0fdf4; padding: 15px; border-radius: 8px; border-left: 4px solid #10b981; margin-top: 15px;">
            <h4 style="color: #047857; margin-top: 0;">Result:</h4>
            <p style="color: #1f2937;">${report.result}</p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px;">
              Please process this report in your system and update the status accordingly.
            </p>
            <p style="color: #6b7280; font-size: 12px;">
              This is an automated notification from the Health Management System.
            </p>
          </div>
        </div>
      `
    });

    console.log(`✅ Lab ${lab.name} notified about report ${report.report_id}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to notify lab:', error);
    return { success: false, error: error.message };
  }
};

const sendEmailNotification = async ({ to, subject, html }) => {
  if (!transporter) {
    throw new Error('Email transporter not configured');
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html
  };

  return await transporter.sendMail(mailOptions);
};

// Alternative notification methods (for future expansion)
const sendSMSNotification = async (phoneNumber, message) => {
  // Implement SMS service like Twilio here
  console.log(`📱 SMS would be sent to ${phoneNumber}: ${message}`);
  return { success: true, method: 'SMS', message: 'SMS service not implemented yet' };
};

const sendPushNotification = async (deviceToken, title, body) => {
  // Implement push notification service like Firebase here
  console.log(`🔔 Push notification would be sent: ${title} - ${body}`);
  return { success: true, method: 'Push', message: 'Push notification service not implemented yet' };
};

// Test email configuration
const testEmailConfiguration = async () => {
  if (!transporter) {
    return { success: false, message: 'Email credentials not configured' };
  }

  try {
    await transporter.verify();
    return { success: true, message: 'Email configuration is valid' };
  } catch (error) {
    return { success: false, message: `Email configuration error: ${error.message}` };
  }
};

module.exports = { 
  notifyLab, 
  sendEmailNotification, 
  sendSMSNotification, 
  sendPushNotification,
  testEmailConfiguration 
};