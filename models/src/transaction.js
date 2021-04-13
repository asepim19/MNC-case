const mongoose = require("mongoose");
const Transaction = mongoose.model(
	"Transaction",
	new mongoose.Schema({
		transaction_id: String,
		user_id: String,
		ammount: Number,
		balance_before: Number,
		balance_after: Number,
		remarks: String,
		transaction_type: String,
		status: String,
		create_date: Date,
	})
);

module.exports = Transaction;
