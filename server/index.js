const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("./src/controllers/deactivateUser.controller");
require("./src/controllers/emailReminder.controller");

const {
	createEmployee,
	getEmployees,
	getEmployee,
	updateEmployee,
	deleteEmployee,
} = require("./src/controllers/Employee.controller");

const { login, signUp } = require("./src/controllers/auth.controller");
const { verifyToken, checkRole } = require("./src/middlewares/auth.middleware");

const app = express();

// Define middleware
app.use(express.json());
app.use(cors());

app.post("/api/login", login);
app.post("/api/signup", signUp);

app.post("/api/employees", verifyToken, checkRole("admin"), createEmployee);
app.get("/api/employees", verifyToken, getEmployees);
app.get("/api/employees/:id", verifyToken, checkRole("admin"), getEmployee);
app.put("/api/employees/:id", verifyToken, checkRole("admin"), updateEmployee);
app.delete(
	"/api/employees/:id",
	verifyToken,
	checkRole("admin"),
	deleteEmployee
);

const port = 4000;

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
