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
        required: false,
    },
    CV: {
        type: String,
        required: false,
    },
    subject: {
        type: String,
        required: true,
    },
    summery: {
        type: String,
        required: true,
    },
    socialMediaAccounts:{
        type:Array,
        required: false,
    },
    wallet: {
        type: Number,
        required: false,
        default:0
    },
});
const Teacher = mongoose.model("Teacher", teacherSchema);
module.exports = Teacher;
