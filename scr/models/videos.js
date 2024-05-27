const { duration } = require("moment");
const mongoose = require("mongoose");
const videoSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "the name of videos is required"],
  },
  description: String,
  duration: Number,
  name_video:String
});
const Video = mongoose.model("Video", videoSchema);
module.exports = Video;
