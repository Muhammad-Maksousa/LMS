const db = require('../models');
const User = db.users;
const CustomError = require("../helpers/errors/custom-errors");
const errors = require("../helpers/errors/errors");
const jwt = require("jsonwebtoken");
const secretKey = require("../helpers/db/config.secret");
class UserService {
    constructor({ firstName, lastName, birthDate, image, credentialId }) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.birthDate = birthDate;
        this.image = image;
        this.credentialId = credentialId;
    }
    async add() {
        const user = new User({
            firstName: this.firstName,
            lastName: this.lastName,
            image: this.image,
            birthDate: Date.parse(this.birthDate),
            credentialId: this.credentialId
        });
        return await user.save();
    }
    async update(id) {
        return User.findOneAndUpdate({ _id: id }, {
            firstName: this.firstName,
            lastName: this.lastName,
            image: this.image,
            birthDate: Date.parse(this.birthDate)
        }, { new: true });//{new:true} to return data after update
    }
    async login(cred){
        const user = await User.findOne({credentialId:cred._id});
        let token = jwt.sign({ userId: user._id, role: cred.role }, secretKey, { expiresIn: "30 days" });
        return {info:user,token:token};
    }
    async enroll(courseId,userId){
        return await User.findByIdAndUpdate(userId,{$push:{enrolledCourses:courseId}}, { new: true });
    }
    async finishCourse(courseId,userId){
        return await User.findByIdAndUpdate(userId,{$push:{finishedCourses:courseId}}, { new: true });
    }
}

module.exports = UserService;