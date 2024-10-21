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
    text: body,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Email sending failed');
  }
}

// Specific function for sending password recovery email
export async function sendRecoveryEmail(to, token, recoveryTexts) {
  const recoveryLink = `${process.env.NEXT_PUBLIC_BASE_URL}/recoveryPassword?token=${token}`;
  const emailBody = recoveryTexts.recoveryEmailBody.replace('{link}', recoveryLink);

  const transporter = nodemailer.createTransport({
    SES: { ses, aws: AWS },
  });
  
  const mailOptions = {
    from: process.env.EMAIL_USER,  // Verified email address
    to,
    subject: recoveryTexts.recoveryEmailSubject,
    text: emailBody,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Email sending failed');
  }
}

// Specific function for sending verification email
export async function sendVerificationEmail(to, verificationCode, verificationTexts) {
  const emailBody = verificationTexts.verificationEmailBody.replace('{code}', verificationCode);

  const transporter = nodemailer.createTransport({
    SES: { ses, aws: AWS },
  });
  
  const mailOptions = {
    from: process.env.EMAIL_USER,  // Verified email address
    to,
    subject: verificationTexts.verificationEmailSubject,
    text: emailBody,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Email sending failed');
  }
}