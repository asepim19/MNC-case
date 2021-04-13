const jwt = require("jsonwebtoken");
const config = require("../config/auth_config");
const db = require("../models");
const User = db.user;
const Role = db.role;

verifyToken = (req, res, next) => {
	let token = req.headers["authorization"];

	if (!token) {
		return res.status(401).send({ message: "Unauthenticated" });
	}

	jwt.verify(token.replace("Bearer ", ""), config.secret, (err, decoded) => {
		if (err) {
			return res.status(401).send({ message: "Unauthenticated" });
		}
		req.user_id = decoded.user_id;
		next();
	});
};

const authToken = {
	verifyToken,
};
module.exports = authToken;
