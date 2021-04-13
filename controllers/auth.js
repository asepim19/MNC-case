const config = require("../config/auth_config");
const db = require("../models");
const User = db.user;
const { v4: uuidv4 } = require("uuid");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
	let { first_name, last_name, phone_number, address, pin } = req.body;
	const user = new User({
		user_id: uuidv4(),
		first_name: first_name,
		last_name: last_name,
		phone_number: phone_number,
		address: address,
		pin: bcrypt.hashSync(pin, 8),
		create_date: Date.now(),
	});

	user.save((err, user) => {
		if (err) {
			res.status(500).send({ message: err });
			return;
		}
		res.status(200).send({
			status: "SUCCESS",
			result: {
				user_id: user.user_id,
				first_name: user.first_name,
				last_name: user.last_name,
				phone_number: user.phone_number,
				address: user.address,
				create_date: user.create_date,
			},
		});
	});
};

exports.signin = (req, res) => {
	let { phone_number, pin } = req.body;
	User.findOne({
		phone_number: phone_number,
	}).exec((err, user) => {
		if (err) {
			res.status(500).send({ message: err });
			return;
		}

		if (!user) {
			return res.status(404).send({ message: "User Not found." });
		}

		let credentialVerify = bcrypt.compareSync(pin, user.pin);
		console.log(credentialVerify);
		if (!credentialVerify) {
			return res.status(401).send({
				message: "Phone number and pin doesn’t match.",
			});
		}

		let token = jwt.sign({ user_id: user.user_id }, config.secret, {
			expiresIn: 86400, // 24 hours
		});
		let refreshToken = jwt.sign(
			{ user_id: user.user_id },
			config.refreshSecret,
			{
				expiresIn: 172800, // 48 hours
			}
		);

		res.status(200).send({
			status: "SUCCESS",
			result: {
				access_token: token,
				refresh_token: refreshToken,
			},
		});
	});
};
