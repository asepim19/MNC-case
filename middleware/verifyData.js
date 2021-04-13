const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

checkPhoneNumber = (req, res, next) => {
	if (!req.body) {
		res.status(400).send({ message: "User Data Required" });
	}
	User.findOne({
		phone_number: req.body.phone_number,
	}).exec((err, user) => {
		if (err) {
			res.status(500).send({ message: err });
			return;
		}
		if (user) {
			res.status(400).send({ message: "Phone Number already registered" });
			return;
		}
		next();
	});
};

const verifyData = {
	checkPhoneNumber,
};

module.exports = verifyData;
