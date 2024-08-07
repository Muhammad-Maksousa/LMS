const mongoose = require("mongoose");
var schema = mongoose.Schema({
    credentialId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "credential",
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: false,
    },
    image: {
        type: String,
        required: false,
    },
    wallet: {
        type: Number,
        default: 0,
    },
    socialMediaAccounts: {
        type: Array,
        require: false
    },
    teachers: [
        {
            startDate: Date,
            endDate: Date,
            teacherId: { type: mongoose.Types.ObjectId, ref: "teacher" },
        }
    ],
},
    {
        timestamps: true,
        strictPopulate: false,
    }
);

schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

const Institute = mongoose.model("institute", schema);
module.exports = Institute;
