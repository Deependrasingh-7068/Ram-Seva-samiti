const nodemailer = require('nodemailer');

const sendAdminCredentials = async (email, name, password, contact) => {
  try {
    // Gmail transporter setup
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'hsingh24803@gmail.com',      // Yahan apni Gmail ID daalein
        pass: 'wzuojxkzjbympvkm  ',   // Yahan Google account ka App Password daalein (Normal password nahi)
      },
    });

    const mailOptions = {
      from: '"Shree Ram Sewa Samiti" <apka_email@gmail.com>',
      to: email,
      subject: 'Samiti Admin Access Credentials',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #0d1b2a; color: #fdfcdc; border-radius: 10px;">
          <h2 style="color: #ffb703;">Shree Ram Sewa Samiti - Admin Portal</h2>
          <p>Namaste <b>${name}</b>,</p>
          <p>Aapko Shree Ram Sewa Samiti ka naya Admin appoint kiya gaya hai.</p>
          <p><b>Aapke Login Credentials:</b></p>
          <ul style="background: #1b263b; padding: 15px; border-radius: 8px; list-style: none;">
            <li><b>Admin Name:</b> ${name}</li>
            <li><b>Contact Number:</b> ${contact}</li>
            <li><b>Admin ID / Email:</b> ${email}</li>
            <li><b>Password:</b> ${password}</li>
          </ul>
          <p>Aap ab inhi credentials ke sath Admin Portal par login kar sakte hain.</p>
          <p style="color: #ffb703; font-size: 12px; margin-top: 20px;">Yeh ek automated message hai, kripya ise kisi ke sath share na karein.</p>
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