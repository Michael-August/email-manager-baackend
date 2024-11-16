const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const {
	createEmployee,
	getEmployees,
	updateEmployee,
	deleteEmployee,
} = require("./src/controllers/Employee.controller");

const { login } = require("./src/controllers/auth.controller");

const app = express();

// Define middleware
app.use(express.json());
app.use(cors());

app.post("/api/login", login);

app.post("/api/employees", createEmployee);
app.get("/api/employees", getEmployees);
app.put("/api/employees/:id", updateEmployee);
app.delete("/api/employees/:id", deleteEmployee);

const port = 4000 || process.env.PORT;

const startApp = async (url) => {
	try {
		await mongoose.connect(url, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log("✅ Connected to Mongo");
		app.listen(port, () => {
			console.log(
				`Welcome to email auto disable 🚀 connected to port ${port}`
			);
		});
	} catch (error) {
		console.log(error);
	}
};

startApp(process.env.DB_URL);
