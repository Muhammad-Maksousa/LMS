const router = require("express").Router();
const controller = require("../controllers/notification");
const apiHandler = require("../helpers/wrappers/api-handler");
const { verifyUserToken, verifyAdminToken } = require("../middleware/auth");

router.post("/send", apiHandler(controller.send));
module.exports = router;