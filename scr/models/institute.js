const mongoose = require("mongoose");
const Scolarship = require("./Scholarship");
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
    location: {
      type: String,
      required: false,
    },
    image: {
      type: String,
      required: false,
    },
    fcm: {
      type: String,
      require: false,
    },
    wallet: {
      type: Number,
      default: 0,
    },
    socialMediaAccounts: {
      type: Array,
      require: false,
    },
    teachers: [
      {
        startDate: Date,
        endDate: Date,
        teacherId: { type: mongoose.Types.ObjectId, ref: "teacher" },
      },
    ],
    scholarship: [{ type: mongoose.Types.ObjectId, ref: "scholarship" }],
    studentScholarship: [
      {
        studentId: { type: mongoose.Types.ObjectId, ref: "user" },
        endDate: Date,
      },
    ],
    myStudent: [
      {
        studentId: { type: mongoose.Types.ObjectId, ref: "user" },
        startDate: { type: Date, default: Date.now },
      },
    ],
    paidStudent: [
      {
        studentId: { type: mongoose.Types.ObjectId, ref: "user" },
        endDate: {
          type: Date,
        },_id:false
      },
    ],
    cost: { type: Number, default: 0 },
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
