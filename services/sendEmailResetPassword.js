// services/sendEmail.js

const nodemailer = require("nodemailer");
const path = require("path");

// Function to send OTP via email
async function sendEmailResetPassword(email, link) {
  // Create a transporter using SMTP transport
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // Replace with your SMTP host
    port: 587, // Replace with your SMTP port
    secure: false, // Set to true if using a secure connection (TLS/SSL)
    auth: {
      user: "ferdy.lz2000@gmail.com", // Replace with your email address
      pass: "dbnovvoivojmmkip", // Replace with your email password
    },
  });

  // Define email options
  const mailOptions = {
    from: "ferdy.lz2000@gmail.com", // Replace with your email address
    to: email, // Recipient's email address
    subject: "Reset Password", // Email subject
    // text: `Ikuti link berikut untuk melakukan reset password : ${link}`, // Email body
    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f5f5f5;
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .container {
          background-color: #ffffff;
          border-radius: 5px;
          padding: 20px;
          text-align: center;
          margin-bottom: 20px;
          width: 100%;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }
        h1 {
          color: #7126b5;
          margin-top: 0;
        }
        p {
          margin-bottom: 20px;
        }
        .otp {
        
          color: #ffffff;
          font-size: 24px;
          font-weight: bold;
          padding: 10px;
          border-radius: 5px;
          width: fit-content;
          margin: 0 auto;
        }
        .box-purple {
          background-color: #7126b5;
          width: 100%;
          padding : 18px;
          height: 150px;
          margin-left: auto;
          margin-right: auto;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .img-logo {
          max-width: 100%;
          max-height: 100%;
          display: block;
          margin-left: auto;
          margin-right: auto;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Reset Password</h1>
        <p>Follow the following link to reset the password</p>
        <div class="otp">${link}</div>
      </div>
    </body>
  </html>
    `,
  };

  // Send the email
  await transporter.sendMail(mailOptions);
}

module.exports = sendEmailResetPassword;
