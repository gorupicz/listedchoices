import nodemailer from 'nodemailer';
import AWS from 'aws-sdk';

// Initialize SES
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,  // Ensure these are set
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,  // Ensure correct region
});

const ses = new AWS.SES();

// Generic function to send email
export async function sendEmail({ to, subject, body }) {

  const transporter = nodemailer.createTransport({
    SES: { ses, aws: AWS },
  });
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html: body,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Email sending failed');
  }
}