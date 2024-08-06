const mongoose = require("mongoose");
const schema = mongoose.Schema({
    teacherToInstitute: {
        teacherId: { type: mongoose.Types.ObjectId, ref: "teacher" },
        instituteId: { type: mongoose.Types.ObjectId, ref: "institute" },
    },
    teacherToPlatform: {
        teacherId: { type: mongoose.Types.ObjectId, ref: "teacher" },
    },
    userToInstitute: {
        userId: { type: mongoose.Types.ObjectId, ref: "user" },
        instituteId: { type: mongoose.Types.ObjectId, ref: "institute" },
    },
    userToInstituteByGrant: {
        userId: { type: mongoose.Types.ObjectId, ref: "user" },
        instituteId: { type: mongoose.Types.ObjectId, ref: "institute" },
    }
},
    {
        timestamps: true,
        strictPopulate: false,
    }
);
const JoinRequists = mongoose.model("joinRequists", schema);
module.exports = JoinRequists;
