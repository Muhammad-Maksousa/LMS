let admin = require("firebase-admin");

let serviceAccount = require("./lms7-92a1e-firebase-adminsdk-i85pw-c73552e09b.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


module.exports.admin=admin;