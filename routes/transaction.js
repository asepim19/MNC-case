const { authToken } = require("../middleware");
const controller = require("../controllers/transaction");

module.exports = function (app) {
	app.use(function (req, res, next) {
		res.header(
			"Access-Control-Allow-Headers",
			"x-access-token, Origin, Content-Type, Accept"
		);
		next();
	});
	app.post("/topup", [authToken.verifyToken], controller.topup);
	app.post("/pay", [authToken.verifyToken], controller.pay);
	app.post("/transfer", [authToken.verifyToken], controller.transfer);
	app.get("/transactions", [authToken.verifyToken], controller.transactions);
};
