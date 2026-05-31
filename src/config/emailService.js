import nodemailer from 'nodemailer';

// Standard Email Sending Service Function
const sendEmail = async (options) => {
  // 📬 NodeMailer Transporter Setup
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // TLS ke liye false
    auth: {
      user: process.env.EMAIL_USER, // Env se load hoga
      pass: process.env.EMAIL_PASS, // Env se load hoga
    },
  });

  // Email parameters details
  const mailOptions = {
    from: `"SecureAuth Team 🛡️" <${process.env.EMAIL_FROM || 'noreply@secureauth.com'}>`,
    to: options.email,
    subject: options.subject,
    html: options.html, // Rich HTML templates support
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✉️ Email successfully sent! Message ID: ${info.messageId}`);
    
    // Agar Ethereal mock use ho raha ho to console mein link print karna
    if (transporter.options.host.includes('ethereal')) {
      console.log(`🔗 Mock Email Preview Link: ${nodemailer.getTestMessageUrl(info)}`);
    }
  } catch (error) {
    console.error('❌ NodeMailer Error:', error.message);
    throw new Error('Email could not be sent');
  }
};

export default sendEmail;