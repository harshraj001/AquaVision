import nodemailer from 'nodemailer';

// Create transporter with Gmail SMTP
const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD
        }
    });
};

// Send export email with download link
export const sendExportEmail = async ({ to, name, downloadLink, stateName, districtName }) => {
    const transporter = createTransporter();

    const locationText = districtName
        ? `${districtName} district, ${stateName}`
        : `all districts in ${stateName}`;

    const mailOptions = {
        from: `"AquaVision India" <${process.env.GMAIL_USER}>`,
        to: to,
        subject: `Your Groundwater Data Export - ${locationText}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #334155; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #0ea5e9, #06b6d4); padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
                    .header h1 { color: white; margin: 0; font-size: 24px; }
                    .content { background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; }
                    .btn { display: inline-block; background: #0284c7; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
                    .btn:hover { background: #0369a1; }
                    .footer { text-align: center; padding: 20px; color: #64748b; font-size: 12px; }
                    .info-box { background: white; border-left: 4px solid #0ea5e9; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🌊 AquaVision India</h1>
                        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Groundwater Monitoring Platform</p>
                    </div>
                    <div class="content">
                        <p>Hello <strong>${name}</strong>,</p>
                        <p>Your groundwater data export is ready for download!</p>
                        
                        <div class="info-box">
                            <strong>📍 Location:</strong> ${locationText}<br>
                            <strong>📊 Format:</strong> CSV (Comma Separated Values)<br>
                            <strong>📅 Generated:</strong> ${new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })}
                        </div>
                        
                        <p style="text-align: center;">
                            <a href="${downloadLink}" class="btn">📥 Download CSV Data</a>
                        </p>
                        
                        <p style="color: #64748b; font-size: 14px;">
                            <em>Note: This download link will expire in 24 hours.</em>
                        </p>
                        
                        <p>Thank you for using AquaVision India for your groundwater research!</p>
                    </div>
                    <div class="footer">
                        <p>This is an automated email from AquaVision India.</p>
                        <p>Data Source: Central Ground Water Board (CGWB) Yearbook 2023-24</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Export email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Failed to send export email:', error);
        throw error;
    }
};

export default { sendExportEmail };
