const mongoose = require("mongoose");
const ScholarshipSchema = mongoose.Schema(
  {
    name: String,
    description: String,
    requirements: [String],
    EndDate: Date,
    lastChance : Date,
  },
  { timestamps: true }
);
ScholarshipSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});
const scholarship = mongoose.model("scholarship", ScholarshipSchema);
module.exports = scholarship;
