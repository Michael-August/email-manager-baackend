const mongoose = require("mongoose");

const allEmployeeSchema = new mongoose.Schema({
	fulName: {
		type: String,
		trim: true,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	phone: {
		type: String,
	},
	position: {
		type: String,
	},
	department: {
		type: String,
	},
	dateOfJoining: {
		type: Date,
		default: Date.now,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
});

// Middleware to update the `updatedAt` field on document update
allEmployeeSchema.pre("save", function (next) {
	this.updatedAt = Date.now();
	next();
});

const AllEmployee = mongoose.model("AllEmployee", allEmployeeSchema);

module.exports = AllEmployee;
