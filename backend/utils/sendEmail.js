const nodemailer = require('nodemailer');

// ⚠️ Ye Samiti ka official contact number hai jo email ke "Regards" section mein dikhega.
// Apna sahi number yahan daal dena.
const OFFICIAL_EMAIL = 'hsingh24803@gmail.com';
const OFFICIAL_CONTACT = '7068180049'; // TODO: Apna Samiti ka official contact number yahan update karein

const sendAdminCredentials = async ({ email, name, contact, aadhaar, dob, loginLink }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'hsingh24803@gmail.com',      // Yahan apni Gmail ID daalein
        pass: 'wzuojxkzjbympvkm',            // Yahan Google account ka App Password daalein (Normal password nahi)
      },
    });

    // Aadhaar mask karo: sirf last 6 digits dikhao, baaki XXXXXX
    const cleanAadhaar = (aadhaar || '').replace(/\D/g, '');
    const last6Aadhaar = cleanAadhaar.slice(-6) || '000000';
    const maskedAdminId = `XXXXXX${last6Aadhaar}`;

    // DOB ko DDMMYYYY format mein convert karo (yehi temporary password hai)
    let dobFormatted = dob || '';
    if (dobFormatted.includes('-')) {
      const parts = dobFormatted.split('-'); // ['YYYY','MM','DD']
      if (parts.length === 3) {
        dobFormatted = `${parts[2]}${parts[1]}${parts[0]}`; // "DDMMYYYY"
      }
    }

    const adminLoginLink = loginLink || 'https://ram-sewa-samiti.vercel.app';

    const mailOptions = {
      from: '"Shree Ram Sewa Samiti" <hsingh24803@gmail.com>',
      to: email,
      subject: 'Welcome to Shri Ram Seva Samiti - Admin Access Credentials',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 24px; background-color: #0d1b2a; color: #fdfcdc; border-radius: 10px; max-width: 560px; margin: auto;">
          <h2 style="color: #ffb703; margin-top:0;">Shri Ram Seva Samiti</h2>

          <p>Dear <b>${name}</b>,</p>
          <p>Welcome to the Shri Ram Seva Samiti Management System.</p>
          <p>Your Admin account has been successfully created by the authorized Super Admin. You can now access the Admin Panel using the credentials provided below.</p>

          <h3 style="color:#ffb703; border-bottom:1px solid #ffb70355; padding-bottom:6px;">Admin Account Details</h3>
          <ul style="background: #1b263b; padding: 16px 20px; border-radius: 8px; list-style: none; margin:0;">
            <li style="padding:4px 0;"><b>Name:</b> ${name}</li>
            <li style="padding:4px 0;"><b>Contact:</b> ${contact}</li>
            <li style="padding:4px 0;"><b>Email:</b> ${email}</li>
            <li style="padding:4px 0;"><b>Admin ID:</b> ${maskedAdminId}</li>
            <li style="padding:4px 0;"><b>Password:</b> ${dobFormatted}</li>
          </ul>

          <div style="text-align:center; margin: 28px 0;">
            <a href="${adminLoginLink}" style="background: linear-gradient(90deg,#ffd166,#ffb703); color:#0d1b2a; text-decoration:none; font-weight:bold; padding: 12px 28px; border-radius: 8px; display:inline-block;">
              Login to Admin Panel
            </a>
          </div>

          <p>Please use the above Admin ID and Password to log in to your account.</p>

          <h3 style="color:#ffb703; border-bottom:1px solid #ffb70355; padding-bottom:6px;">Important Security Information</h3>
          <ul style="line-height:1.7;">
            <li>Your Admin ID is partially masked for security purposes.</li>
            <li>Your temporary password is your Date of Birth in DDMMYYYY format.</li>
            <li>Please change your password after your first successful login.</li>
            <li>Do not share your Admin credentials with anyone.</li>
            <li>If you did not request or authorize this account, please contact the Samiti's authorized administrator immediately.</li>
          </ul>

          <p style="margin-top:28px;">Regards,<br/>
          <b>Shri Ram Seva Samiti</b><br/>
          Admin Management System<br/>
          Email: ${OFFICIAL_EMAIL}<br/>
          Contact: ${OFFICIAL_CONTACT}</p>

          <p style="color: #ffb703; font-size: 12px; margin-top: 24px;">This is an automated message, please do not reply.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Admin credentials email sent successfully!');
  } catch (error) {
    console.error('Email sending failed:', error);
  }
};

module.exports = sendAdminCredentials;