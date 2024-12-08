const mongoose = require("mongoose");

const CompanyPropertySchema = new mongoose.Schema({
	propertyName: {
		type: String,
		required: true,
	},
	employeeId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "AllEmployee",
		default: null,
	},
	status: {
		type: String,
		enum: ["returned", "not returned"],
		default: "not returned",
	},
	issuedDate: {
		type: Date,
		default: Date.now,
	},
	returnedDate: {
		type: Date,
	},
});

const CompanyProperty = mongoose.model(
	"CompanyProperty",
	CompanyPropertySchema
);

module.exports = CompanyProperty;
