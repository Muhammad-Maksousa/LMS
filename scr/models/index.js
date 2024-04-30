const dbConfig = require("../helpers/db/db.config.js");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.credentials = require("./credential.js")(mongoose);
db.users = require("./user.js")(mongoose);

module.exports = db;