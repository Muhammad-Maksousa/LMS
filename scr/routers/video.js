const express = require("express");
const router = express.Router();
const video = require("./../controllers/video");
const apiHandler = require("../helpers/wrappers/api-handler");
const upload = require('../helpers/uploadVideo')
router.get("/all", apiHandler(video.getAllVideo));
router.post("/", upload.single('name_video'), apiHandler(video.addVideo));
router.get("/:id", apiHandler(video.getVideo));
router.delete("/:id", apiHandler(video.deleteVideo));
router.patch("/:id", upload.single('name_video'), apiHandler(video.updateVideo));
module.exports = router;
