const axios = require("axios");
require("dotenv").config();

let accessToken = null;

async function refreshAccessToken() {
	const { ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_REFRESH_TOKEN } =
		process.env;

	try {
		const response = await axios.post(
			"https://accounts.zoho.com/oauth/v2/token",
			null,
			{
				params: {
					refresh_token: ZOHO_REFRESH_TOKEN,
					client_id: ZOHO_CLIENT_ID,
					client_secret: ZOHO_CLIENT_SECRET,
					grant_type: "refresh_token",
				},
			}
		);
		accessToken = response.data.access_token;
		return accessToken;
	} catch (error) {
		console.error(
			"Failed to refresh access token:",
			error.response ? error.response.data : error.message
		);
		throw new Error("Could not refresh access token");
	}
}

async function getAccessToken() {
	if (!accessToken) {
		accessToken = await refreshAccessToken();
	}
	return accessToken;
}

module.exports = { getAccessToken, refreshAccessToken };
