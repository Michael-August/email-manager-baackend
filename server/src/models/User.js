const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
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
	password: {
		type: String,
		required: true,
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
userSchema.pre("save", function (next) {
	this.updatedAt = Date.now();
	next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
