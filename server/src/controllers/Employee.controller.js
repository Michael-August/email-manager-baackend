const Employee = require("../models/Employee");
const { getAccessToken } = require("../../zoho.auth");

const axios = require("axios");

// Helper function to check if a user exists
async function checkUserExists(email) {
	const accessToken = await getAccessToken();
	try {
		const response = await axios.get(
			`https://mail.zoho.com/api/organization/${process.env.ZOHO_ORG_ID}/accounts/${email}`,
			{
				headers: { Authorization: `Zoho-oauthtoken ${accessToken}` },
			}
		);
		const user = response.data.data;
		return user;
	} catch (error) {
		console.error(
			"Error fetching users:",
			error.response ? error.response.data : error.message
		);
		throw new Error(
			"Could not validate user, provide a valid organization email"
		);
	}
}

exports.createEmployee = async (req, res) => {
	const { email } = req.body;
	try {
		const user = await checkUserExists(email);
		if (!user) {
			res.status(404).json({
				message: "User not found, provide a valid organization user",
			});
		}

		const existingUser = await Employee.findOne({ email });

		const employee = new Employee(req.body);
		await employee.save();
		res.status(201).json({
			data: employee,
			message: "Creation successful",
		});
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

exports.getEmployees = async (req, res) => {
	try {
		const employees = await Employee.find();
		res.status(200).json({ data: employees, message: "Fetch successful" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

exports.getEmployee = async (req, res) => {
	try {
		const id = req.params.id;
		const employee = await Employee.findById(id);
		res.status(200).json({ data: employee, message: "Fetch successful" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

exports.updateEmployee = async (req, res) => {
	try {
		const id = req.params.id;
		const user = await checkUserExists(req.body.email);
		if (!user) {
			res.status(404).json({
				message: "User not found, provide a valid organization user",
			});
		}
		const updatedEmployee = await Employee.findByIdAndUpdate(id, req.body, {
			new: true,
		});
		res.status(200).json({
			data: updatedEmployee,
			message: "Update Successful",
		});
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

exports.deleteEmployee = async (req, res) => {
	try {
		const id = req.params.id;
		await Employee.findByIdAndDelete(id);
		res.status(204).json({ message: "Employee deleted successfully" });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};
