const Role = require('../helpers/roles');
const bcrypt = require("bcryptjs");
module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      email: {
        type: String,
        required: true,
        unique: true
      },
      password: {
        type: String,
        required: true,
      },
      role: {
        type: String,
        required: true,
        default: Role.user
      },
    },
    { timestamps: true, strictPopulate: false }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Credential = mongoose.model("credential", schema);
  module.exports = Credential;
};