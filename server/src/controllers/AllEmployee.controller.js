const AllEmployee = require("../models/AllEmployee");
const CompanyProperty = require("../models/CompanyProperty");

exports.onboardEmployee = async (req, res) => {
	try {
		const existingUser = await AllEmployee.findOne({
			email: req.body.email,
		});
		if (existingUser) {
			res.status(404).json({
				message: "Employee with this email already exist",
			});
		}

		const employee = new AllEmployee(req.body);
		const savedEmployee = await employee.save();
		res.status(201).json(savedEmployee);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

exports.getAllEmployees = async (req, res) => {
	try {
		const employees = await AllEmployee.find();
		res.json(employees);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

exports.assignProperty = async (req, res) => {
	try {
		const { propertyId, employeeId } = req.body;

		// Ensure both the property and employee exist
		const property = await CompanyProperty.findById(propertyId);
		if (!property) {
			return res.status(404).json({ message: "Property not found" });
		}

		const employee = await AllEmployee.findById(employeeId);
		if (!employee) {
			return res.status(404).json({ message: "Employee not found" });
		}

		// Update the property assignment
		property.employeeId = employeeId;
		property.issuedDate = new Date(); // Optionally set the issued date
		const updatedProperty = await property.save();

		res.json(updatedProperty);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

exports.getPropertiesOfEmployee = async (req, res) => {
	try {
		const properties = await CompanyProperty.find({
			employeeId: req.params.id,
		});
		res.json(properties);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

exports.returnProperty = async (req, res) => {
	try {
		const { propertyId } = req.body;

		// Ensure the property exists
		const property = await CompanyProperty.findById(propertyId);
		if (!property) {
			return res.status(404).json({ message: "Property not found" });
		}

		// Update the property status and return date
		property.status =
			property.status === "not returned" ? "returned" : "not returned";
		property.returnedDate = new Date();

		const updatedProperty = await property.save();

		res.json(updatedProperty);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};
