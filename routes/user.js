const { authToken } = require("../middleware");
const controller = require("../controllers/user");

module.exports = function (app) {
	app.use(function (req, res, next) {
		res.header(
			"Access-Control-Allow-Headers",
			"x-access-token, Origin, Content-Type, Accept"
		);
		next();
	});
	app.put("/profile", [authToken.verifyToken], controller.profile);
};
