const express = require("express");
const port = process.env.PORT || 8080;
const logger = require('morgan');
const cors = require('cors');
const db = require("./models");
const app = express();

app.use(express.static(__dirname + '/public'));
// Log requests to the console.
app.use(logger('dev'));
//allow the client to access the server
app.options('*', cors());

app.use(express.urlencoded({ extended: false }));


db.mongoose.connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to the database!");
}).catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
});
// cors policies
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
});
app.use(express.json({}));
app.use(require("./routers"));
app.use(require("./helpers/errors/custom-errors").defaultHandler);
app.listen(port, () => {
    console.log(`Server is listening on ${port}`);

});