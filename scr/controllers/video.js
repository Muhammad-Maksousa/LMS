const Video = require("./../models/videos");
const fs = require("fs/promises");
const path = require("path");
const {
  responseSender,
  updateResponseSender,
} = require("./../helpers/wrappers/response-sender");
const Course = require("./../models/course")
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
      let video1 = await Video.findById(req.params.id);
      const filePath = path.resolve(__dirname, '..', '..', 'public', 'video', video1.name_video)
        console.log("video.name_video: "+ video1.name_video)
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
    const filePath = path.resolve(__dirname, '..', '..', 'public', 'video', video.name_video)
    console.log("Deleted video file:", filePath);
    await fs.unlink(filePath);
    res.status(204).json({
      status: "succses",
    });
  },
  getAllVideo: async (req, res) => {
    const courseId = req.params.id
    const videos = await Course.findById(courseId).select("video").populate("video")
    responseSender(res, videos);
  },
  getVideo: async (req, res) => {
    const video = await Video.findById(req.params.id);
    responseSender(res, video);
  },
};
