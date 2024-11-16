const Employee = require("../models/Employee");

// Helper function to check if a user exists
async function checkUserExists(email) {
	const accessToken = await getAccessToken();
	try {
		const response = await axios.get(
			`https://mail.zoho.com/api/organization/${ZOHO_ORG_ID}/users`,
			{
				headers: { Authorization: `Zoho-oauthtoken ${accessToken}` },
			}
		);
		const users = response.data.data;
		return users.find((user) => user.email === email);
	} catch (error) {
		console.error(
			"Error fetching users:",
			error.response ? error.response.data : error.message
		);
		throw new Error("Could not validate user");
	}
}

exports.createEmployee = async (req, res) => {
	const { email } = req.body;
	try {
		const user = await checkUserExists(email);
		if (!user) {
			res.status(404).json({
				message: "User not found, provide a valid user",
			});
		}

		const employee = new Employee(req.body);
		await employee.save();
		res.status(201).json(employee);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

exports.getEmployees = async (req, res) => {
	try {
		const employees = await Employee.find();
		res.json(employees);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

exports.updateEmployee = async (req, res) => {
	try {
		const id = req.params.id;
		const updatedEmployee = await Employee.findByIdAndUpdate(id, req.body, {
			new: true,
		});
		res.json(updatedEmployee);
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
