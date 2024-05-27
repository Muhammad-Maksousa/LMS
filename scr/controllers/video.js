const Video = require("./../models/videos");
const fs = require("fs/promises");
const path = require("path");
const {
  responseSender,
  updateResponseSender,
} = require("./../helpers/wrappers/response-sender");
module.exports = {
  addVideo: async (req, res) => {
    let newVideo = { ...req.body };
    newVideo.name_video = req.file.filename;
    console.log(newVideo);
    newVideo = await Video.create(newVideo);

    responseSender(res, newVideo);
  },
  updateVideo: async (req, res) => {
    let video = { ...req.body };
    if (req.file) {
      video.name_video = req.file.filename;
      video1 = await Video.findById(req.params.id);
      const filePath =
        "C:\\Users\\Eam Kadry\\Desktop\\ITE 4th\\مشروع 1\\LMS\\public\\video\\" +
        video1.name_video;
      console.log("Deleted video file:", filePath);
      await fs.unlink(filePath);
    }

    video = await Video.findByIdAndUpdate(req.params.id, video, {
      new: true,
      runValdiators: true,
    });

    res.status(201).json({
      status: "sucsses",
      result: video,
    });
  },
  deleteVideo: async (req, res) => {
    const video = await Video.findByIdAndDelete(req.params.id);
    const filePath =
      "C:\\Users\\Eam Kadry\\Desktop\\ITE 4th\\مشروع 1\\LMS\\public\\video\\" +
      video.name_video;
    console.log("Deleted video file:", filePath);
    await fs.unlink(filePath);
    res.status(204).json({
      status: "succses",
    });
  },
  getAllVideo: async (req, res) => {
    const videos = await Video.find();
    responseSender(res, videos);
  },
  getVideo: async (req, res) => {
    const video = await Video.findById(req.params.id);
    responseSender(res, video);
  },
};
