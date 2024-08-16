const mongoose = require("mongoose");
const { Schema } = mongoose
const schema = new Schema({
    senderName: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true,
    },
    courseId: {
        type: mongoose.Types.ObjectId,
        ref: "course",
      },
},
    { timestamps: true }
);
const chatMessage = mongoose.model("chatMessage", schema);
module.exports = chatMessage;
