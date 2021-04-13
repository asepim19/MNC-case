const config = require("../config/auth_config");
const db = require("../models");
const User = db.user;
var bcrypt = require("bcryptjs");

exports.profile = (req, res) => {
	let data = req.body;
	let update = {};
	if (data.first_name) Object.assign(update, { first_name: data.first_name });
	if (data.last_name) Object.assign(update, { last_name: data.last_name });
	if (data.address) Object.assign(update, { address: data.address });
	if (data.pin) Object.assign(update, { pin: bcrypt.hashSync(data.pin, 8) });
	Object.assign(update, { update_date: Date.now() });
	User.updateOne(
		{
			user_id: req.user_id,
		},
		update
	).exec((err, data) => {
		if (err) {
			res.status(500).send({ message: err });
			return;
		}
		User.findOne({
			user_id: req.user_id,
		}).exec((err, user) => {
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
					address: user.address,
					update_date: user.update_date,
				},
			});
		});
	});
};
