const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
	fullName: {
		type: String,
		trim: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		lowercase: true,
	},
	employeeId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "AllEmployee",
		required: true,
	},
	resignationDate: {
		type: Date,
		required: true,
	},
	disabled: {
		type: Boolean,
		default: false,
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
employeeSchema.pre("save", function (next) {
	this.updatedAt = Date.now();
	next();
});

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
