const CompanyProperty = require("../models/CompanyProperty");

exports.createProperty = async (req, res) => {
	try {
		const property = new CompanyProperty({
			...req.body,
			employeeId: null,
			status: "not returned",
		});
		const savedProperty = await property.save();
		res.status(201).json(savedProperty);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};
