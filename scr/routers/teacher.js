const express = require("express");
const router = express.Router();
const controller = require("./../controllers/teacher");
const apiHandler = require("../helpers/wrappers/api-handler");
const upload = require('../helpers/uploadSingleImage');

router.post("/", upload.any(), apiHandler(controller.add));
router.post("/", apiHandler(controller.login));
router.put("/", upload.any(), apiHandler(controller.update));
router.get("/",apiHandler(controller.getProfile));

module.exports = router;
