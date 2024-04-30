module.exports = mongoose => {
    var schema = mongoose.Schema(
        {
            credentialId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "credential",
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
                type: Array
            },
            enrolledCourses: {
                type: Array
            }
        },
        { timestamps: true }
    );

    schema.method("toJSON", function () {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const User = mongoose.model("user", schema);
    return User;
};