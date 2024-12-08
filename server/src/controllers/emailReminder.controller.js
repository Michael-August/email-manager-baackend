const nodemailer = require("nodemailer");
const cron = require("node-cron");
require("dotenv").config();

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASSWORD,
	},
});

// Step 2: Define the email sending function
const sendScheduledEmail = () => {
	const mailOptions = {
		from: process.env.EMAIL_USER, // Sender email
		to: "michaelfrancis135@gmail.com", // Replace with recipient's email
		subject: "Leaving employee reminder", // Email subject
		text: "Hello! This is a reminder from the admin to add employees up for resignation into the system for automatic deactivation.",
	};

	// Send the email
	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.error("Error sending email:", error);
		} else {
			console.log("Email sent successfully:", info.response);
		}
	});
};

// Example: Schedule the email to be sent every day at 9:00 AM
cron.schedule("0 0 * * *", () => {
	console.log("Running scheduled task: Sending email");
	sendScheduledEmail();
});
