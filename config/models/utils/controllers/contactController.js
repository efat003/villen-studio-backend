// controllers/contactController.js
import nodemailer from 'nodemailer';

// @desc    Send contact message
// @route   POST /api/contact
// @access  Public
export const sendContactMessage = async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        // Create email transporter
        const transporter = nodemailer.createTransporter({
            service: process.env.EMAIL_SERVICE,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Email content
        const mailOptions = {
            from: email,
            to: process.env.EMAIL_USER,
            subject: `Contact Form: ${subject}`,
            html: `
                <h3>New Contact Message</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `
        };

        await transporter.sendMail(mailOptions);

        res.json({
            success: true,
            message: 'Message sent successfully. We will contact you soon.'
        });
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send message. Please try again later.'
        });
    }
};

// @desc    Subscribe to newsletter
// @route   POST /api/contact/subscribe
// @access  Public
export const subscribeNewsletter = async (req, res) => {
    try {
        const { email } = req.body;

        // Here you can save to database or send to email service
        // For now, we'll just return success

        res.json({
            success: true,
            message: 'Successfully subscribed to newsletter'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Subscription failed. Please try again.'
        });
    }
};