const router = require("express").Router();
const controller = require("../controllers/user");
const apiHandler = require("../helpers/wrappers/api-handler");
const { verifyUserToken, verifyAdminToken } = require("../middleware/auth");


router.post("/", apiHandler(controller.add));
router.put("/update", apiHandler(controller.update));

module.exports = router;