const mongoose = require("mongoose");
var schema = mongoose.Schema(
    {
        credentialId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "credential",
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        fcm: {
            type: String,
        },
        image: {
            type: String,
            required: false,
        },
        wallet: {
            type: Number,
            default: 0,
        }
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

const Admin = mongoose.model("admin", schema);
module.exports = Admin;
