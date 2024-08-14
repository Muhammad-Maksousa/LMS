const express = require("express");
const router = express.Router();
const controller = require("./../controllers/admin");
const apiHandler = require("./../helpers/wrappers/api-handler");
const { verifyAdminToken } = require("../middleware/auth");

router.post("/",apiHandler(controller.add));
router.post("/login",apiHandler(controller.login));
router.put("/",apiHandler(verifyAdminToken),apiHandler(controller.update));


module.exports = router;
