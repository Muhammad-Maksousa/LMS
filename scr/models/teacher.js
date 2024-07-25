const mongoose = require("mongoose");
const teacherSchema = mongoose.Schema({
    credentialId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "credential",
        required: true,
      },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    CV: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    summery: {
        type: String,
        required: false,
    },
    socialMediaAccounts:{
        type:Array,
        required: false,
    },
    wallet: {
        type: Number,
        required: true,
        default:0
    },
    status: {
        type: String,
        required: true,
        default:"pending"
    },
});
const Teacher = mongoose.model("Teacher", teacherSchema);
module.exports = Teacher;
