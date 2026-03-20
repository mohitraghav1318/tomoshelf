const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'mohitraghav911@gmail.com',
        pass: process.env.EMAIL_APP_PASS
    }
});

const sendOTP = async (email, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_USER || 'mohitraghav911@gmail.com',
        to: email,
        subject: 'TomoShelf - Your 2FA Verification Code',
        html: `
            <div style="font-family: Montserrat, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #000; color: #fff;">
                <h2 style="color: #ef4444; text-align: center;">TomoShelf Verification</h2>
                <p>Hello,</p>
                <p>You requested a verification code to enable Two-Factor Authentication on your TomoShelf account.</p>
                <div style="background-color: #1a1a1a; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                    <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #ef4444;">${otp}</span>
                </div>
                <p style="font-size: 14px; color: #94a3b8;">This code will expire in 10 minutes.</p>
                <p>If you did not request this code, please ignore this email.</p>
                <hr style="border: 0; border-top: 1px solid #334155; margin: 20px 0;">
                <p style="font-size: 12px; color: #64748b; text-align: center;">&copy; ${new Date().getFullYear()} TomoShelf. All rights reserved.</p>
            </div>
        `
    };

    return transporter.sendMail(mailOptions);
};

const sendDeleteOTP = async (email, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_USER || 'mohitraghav911@gmail.com',
        to: email,
        subject: 'TomoShelf - Account Deletion Request',
        html: `
            <div style="font-family: Montserrat, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ef4444; border-radius: 12px; background-color: #000; color: #fff;">
                <h2 style="color: #ef4444; text-align: center;">Account Deletion Security Code</h2>
                <p>Hello,</p>
                <p>We received a request to permanently delete your TomoShelf account. For your security, please use the following code to confirm this action:</p>
                <div style="background-color: #1a1a1a; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                    <span style="font-size: 40px; font-weight: bold; letter-spacing: 12px; color: #ef4444;">${otp}</span>
                </div>
                <p style="font-weight: bold; color: #ef4444;">This code is valid for 3 minutes only.</p>
                <p style="font-size: 14px; color: #94a3b8;">WARNING: Deleting your account is permanent and cannot be undone. All your shelves, data, and settings will be lost forever.</p>
                <p>If you did not request to delete your account, please secure your account immediately.</p>
                <hr style="border: 0; border-top: 1px solid #334155; margin: 20px 0;">
                <p style="font-size: 12px; color: #64748b; text-align: center;">&copy; ${new Date().getFullYear()} TomoShelf. All rights reserved.</p>
            </div>
        `
    };

    return transporter.sendMail(mailOptions);
};

module.exports = {
    sendOTP,
    sendDeleteOTP
};
