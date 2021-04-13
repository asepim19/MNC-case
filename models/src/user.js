const mongoose = require("mongoose");

const User = mongoose.model(
	"User",
	new mongoose.Schema({
		user_id: String,
		first_name: String,
		last_name: String,
		phone_number: String,
		address: String,
		pin: String,
		create_date: Date,
		update_date: Date,
	})
);

module.exports = User;
