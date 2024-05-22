const Course = require("./../models/course");
module.exports = mongoose => {
    var schema = mongoose.Schema(
        {
            credentialId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "credentials",
                required: true
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
            birthDate: {
                type: Date,
                required: false,
            },
            finishedCourses: {
                type: Array,
                ref: 'courses'
            },
            enrolledCourses: {
                type: Array,
                ref: 'courses'
            }
        },
        {
            timestamps: true,
            strictPopulate: false
        }
    );

    schema.method("toJSON", function () {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const User = mongoose.model("user", schema);
    module.exports = User;
};