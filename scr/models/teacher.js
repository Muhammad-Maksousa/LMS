const Course = require("./../models/course");
const mongoose = require("mongoose");
var schema = mongoose.Schema({
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
  status: {
    type: String,
    default: "pending"
  },
  wallet: {
    type: Number,
    default: 0,
  },
  subject: {
    type: String,
    require: true,
  },
  summery: {
    type: String,
    require: false,
  },
  socialMediaAccounts: {
    type: Array,
    require: false
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

const Teacher = mongoose.model("teacher", schema);
module.exports = Teacher;
