const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const Config = require("./config/db_config");

const app = express();
var corsOptions = {
	origin: "http://localhost:1304",
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./models");
db.mongoose
	.connect(`mongodb://${Config.HOST}:${Config.PORT}/${Config.DB}`, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log("Successfully connect to MongoDB.");
	})
	.catch((err) => {
		console.error("Connection error", err);
		process.exit();
	});

app.get("/", (req, res) => {
	res.json({ message: "Hello World" });
});

require("./routes/auth")(app);
require("./routes/user")(app);
require("./routes/transaction")(app);

const PORT = process.env.PORT || 1304;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}.`);
});
