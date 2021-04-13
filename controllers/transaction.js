const config = require("../config/auth_config");
const db = require("../models");
const Transaction = db.transaction;
const User = db.user;
const { v4: uuidv4 } = require("uuid");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.topup = (req, res) => {
	let { ammount } = req.body;
	Transaction.find({
		user_id: req.user_id,
	}).exec((err, data) => {
		if (err) {
			res.status(500).send({ message: err });
			return;
		}
		if (data.length < 1) {
			let topup = new Transaction({
				transaction_id: uuidv4(),
				user_id: req.user_id,
				ammount: parseInt(ammount),
				balance_before: 0,
				balance_after: parseInt(ammount),
				transaction_type: "CREDIT",
				status: "SUCCESS",
				remarks: "TOPUP",
				create_date: Date.now(),
			});
			topup.save((err, transactionResult) => {
				if (err) {
					res.status(500).send({ message: err });
					return;
				}
				res.status(200).send({
					status: "SUCCESS",
					result: {
						top_up_id: transactionResult.transaction_id,
						ammount_top_up: transactionResult.ammount,
						balance_before: transactionResult.balance_before,
						balance_after: transactionResult.balance_after,
						create_date: transactionResult.create_date,
					},
				});
			});
		} else {
			let topup = new Transaction({
				transaction_id: uuidv4(),
				user_id: req.user_id,
				ammount: parseInt(ammount),
				balance_before: parseInt(data[data.length - 1].balance_after),
				balance_after:
					parseInt(data[data.length - 1].balance_after) + parseInt(ammount),
				transaction_type: "CREDIT",
				status: "SUCCESS",
				remarks: "TOPUP",
				create_date: Date.now(),
			});
			topup.save((err, transactionResult) => {
				if (err) {
					res.status(500).send({ message: err });
					return;
				}
				res.status(200).send({
					status: "SUCCESS",
					result: {
						top_up_id: transactionResult.transaction_id,
						ammount_top_up: transactionResult.ammount,
						balance_before: transactionResult.balance_before,
						balance_after: transactionResult.balance_after,
						create_date: transactionResult.create_date,
					},
				});
			});
		}
	});
};

exports.pay = (req, res) => {
	let { ammount, remarks } = req.body;
	Transaction.find({
		user_id: req.user_id,
	}).exec((err, data) => {
		if (err) {
			res.status(500).send({ message: err });
			return;
		}
		if (data.length < 1) {
			res.status(400).send({
				message: "Balance is not enough",
			});
		} else {
			if (parseInt(data[data.length - 1].balance_after) >= parseInt(ammount)) {
				let trx = new Transaction({
					transaction_id: uuidv4(),
					user_id: req.user_id,
					ammount: parseInt(ammount),
					balance_before: parseInt(data[data.length - 1].balance_after),
					balance_after:
						parseInt(data[data.length - 1].balance_after) - parseInt(ammount),
					transaction_type: "DEBIT",
					status: "SUCCESS",
					remarks: remarks,
					create_date: Date.now(),
				});
				trx.save((err, transactionResult) => {
					if (err) {
						res.status(500).send({ message: err });
						return;
					}
					res.status(200).send({
						status: "SUCCESS",
						result: {
							payment_id: transactionResult.transaction_id,
							ammount: transactionResult.ammount,
							remarks: transactionResult.remarks,
							balance_before: transactionResult.balance_before,
							balance_after: transactionResult.balance_after,
							create_date: transactionResult.create_date,
						},
					});
				});
			} else {
				res.status(400).send({
					message: "Balance is not enough",
				});
			}
		}
	});
};

exports.transfer = (req, res) => {
	let { ammount, remarks, target_user } = req.body;
	Transaction.find({
		user_id: req.user_id,
	}).exec((err, data) => {
		if (err) {
			res.status(500).send({ message: err });
			return;
		}
		if (data.length < 1) {
			res.status(400).send({
				message: "Balance is not enough",
			});
		} else {
			if (parseInt(data[data.length - 1].balance_after) >= parseInt(ammount)) {
				User.findOne({ user_id: target_user }).exec((err, user) => {
					if (err) {
						res.status(500).send({ message: err });
					}
					if (!user) {
						res.status(400).send({ message: "User Target Doesn't Exist" });
					}
					let trx = new Transaction({
						transaction_id: uuidv4(),
						user_id: req.user_id,
						ammount: parseInt(ammount),
						balance_before: parseInt(data[data.length - 1].balance_after),
						balance_after:
							parseInt(data[data.length - 1].balance_after) - parseInt(ammount),
						transaction_type: "DEBIT",
						status: "SUCCESS",
						remarks: remarks,
						create_date: Date.now(),
					});
					trx.save((err, transactionResult) => {
						if (err) {
							res.status(500).send({ message: err });
							return;
						}
						Transaction.find({
							user_id: target_user,
						}).exec((err, target) => {
							let topup;
							if (target.length < 1) {
								topup = new Transaction({
									transaction_id: uuidv4(),
									user_id: target_user,
									ammount: parseInt(ammount),
									balance_before: 0,
									balance_after: parseInt(ammount),
									transaction_type: "CREDIT",
									status: "SUCCESS",
									remarks: "TOPUP",
									create_date: Date.now(),
								});
							} else {
								topup = new Transaction({
									transaction_id: uuidv4(),
									user_id: target_user,
									ammount: parseInt(ammount),
									balance_before: parseInt(
										target[target.length - 1].balance_after
									),
									balance_after:
										parseInt(target[target.length - 1].balance_after) +
										parseInt(ammount),
									transaction_type: "CREDIT",
									status: "SUCCESS",
									remarks: "TOPUP",
									create_date: Date.now(),
								});
							}
							topup.save((err, targetRes) => {
								if (err) {
									res.status(500).send({ message: err });
									return;
								}
								res.status(200).send({
									status: "SUCCESS",
									result: {
										transfer_id: transactionResult.transaction_id,
										ammount: transactionResult.ammount,
										remarks: transactionResult.remarks,
										balance_before: transactionResult.balance_before,
										balance_after: transactionResult.balance_after,
										create_date: transactionResult.create_date,
									},
								});
							});
						});
					});
				});
			} else {
				res.status(400).send({
					message: "Balance is not enough",
				});
			}
		}
	});
};

exports.transactions = (req, res) => {
	Transaction.find({
		user_id: req.user_id,
	}).exec((err, data) => {
		if (err) {
			res.status(500).send({ message: err });
			return;
		}
		res.status(200).send({
			status: "SUCCESS",
			result: data,
		});
	});
};
