const cron = require("node-cron");
const mongoose = require("mongoose");
const axios = require("axios");
const { getAccessToken } = require("../../zoho.auth");
const Employee = require("../models/Employee");

async function deactivateEmailInZoho(email) {
	try {
		const accessToken = await getAccessToken();
		const ZOHO_ORG_ID = process.env.ZOHO_ORG_ID;

		// Fetch the user details from Zoho
		const userResponse = await axios.get(
			`https://mail.zoho.com/api/organization/${ZOHO_ORG_ID}/accounts/${email}`,
			{
				headers: { Authorization: `Zoho-oauthtoken ${accessToken}` },
			}
		);

		const user = userResponse.data.data;
		if (!user) {
			console.log(`User with email ${email} not found in Zoho.`);
			return;
		}

		// Deactivate the user's email account in Zoho
		await axios.put(
			`https://mail.zoho.com/api/organization/${ZOHO_ORG_ID}/accounts/${user.accountId}`,
			{
				mode: "disableUser",
				zuid: user.zuid,
				blockIncoming: true,
				removeMailforward: true,
				removeGroupMembership: true,
				removeAlias: true,
			},
			{ headers: { Authorization: `Zoho-oauthtoken ${accessToken}` } }
		);

		console.log(`Successfully deactivated email for ${email} in Zoho.`);
	} catch (error) {
		console.error(
			`Error deactivating email for ${email}:`,
			error.response ? error.response.data : error.message
		);
	}
}

// Function to check resignation dates and deactivate emails
async function checkResignationDates() {
	const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

	try {
		// Find employees whose resignation date is today
		const employeesToDeactivate = await Employee.find({
			resignationDate: today,
		});

		// Deactivate each employee's email in Zoho
		for (const employee of employeesToDeactivate) {
			await deactivateEmailInZoho(employee.email);
		}
	} catch (error) {
		console.error("Error checking resignation dates:", error.message);
	}
}

cron.schedule("* * * * *", () => {
	console.log("Running daily check for employee resignation dates...");
	checkResignationDates();
});

module.exports = { checkResignationDates };
