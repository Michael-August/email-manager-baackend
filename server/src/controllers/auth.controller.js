const dotenv = require("dotenv");
const User = require("../models/User");
dotenv.config();

exports.login = async (req, res) => {
	const { email, password } = req.body;

	// Find user in local database
	const user = User.findOne({ email });
	if (!user) {
		return res.status(404).json({ message: "User not found" });
	}

	// Validate password
	const isPasswordValid = bcrypt.compareSync(password, user.password);
	if (!isPasswordValid) {
		return res.status(401).json({ message: "Invalid password" });
	}

	// Fetch user details from Zoho
	try {
		const accessToken = await getAccessToken();
		const response = await axios.get(
			`https://mail.zoho.com/api/organization/${process.env.ZOHO_ORG_ID}/users`,
			{
				headers: { Authorization: `Zoho-oauthtoken ${accessToken}` },
			}
		);

		const zohoUser = response.data.data.find((u) => u.email === email);
		if (!zohoUser) {
			return res.status(404).json({ message: "Zoho user not found" });
		}

		// Generate JWT token
		const token = jwt.sign(
			{ email, role: zohoUser.role },
			process.env.JWT_SECRET,
			{
				expiresIn: "1h",
			}
		);

		// Return token and Zoho user details
		res.json({ token, userDetails: zohoUser });
	} catch (error) {
		console.error(
			"Error fetching Zoho user details:",
			error.response ? error.response.data : error.message
		);
		res.status(500).json({ error: "Failed to retrieve Zoho user details" });
	}
};
