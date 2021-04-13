const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const db = {};
db.mongoose = mongoose;
db.user = require("./src/user");
db.transaction = require("./src/transaction");
module.exports = db;
