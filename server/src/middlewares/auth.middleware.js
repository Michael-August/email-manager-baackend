// middlewares/auth.js
const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Middleware to verify JWT token.
 */
function verifyToken(req, res, next) {
	const authHeader = req.headers.authorization;
	if (!authHeader) {
		return res
			.status(401)
			.json({ message: "Authorization token required" });
	}

	const token = authHeader.split(" ")[1];
	jwt.verify(token, JWT_SECRET, (err, decoded) => {
		if (err) {
			return res.status(403).json({ message: "Invalid token" });
		}

		// Attach decoded token data (email, role) to request object
		req.user = decoded;
		next();
	});
}

/**
 * Middleware to check user role.
 * @param {string} requiredRole - The required role for the route.
 */
function checkRole(requiredRole) {
	return (req, res, next) => {
		if (!req.user) {
			return res.status(403).json({ message: "User not authenticated" });
		}

		if (req.user.role !== requiredRole) {
			return res.status(403).json({
				message: `Insufficient role: requires ${requiredRole} to perform this action`,
			});
		}

		// Role is authorized
		next();
	};
}

module.exports = { verifyToken, checkRole };
