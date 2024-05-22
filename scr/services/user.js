const User = require('../models/user');
const roles = require("../helpers/roles");
const CustomError = require("../helpers/errors/custom-errors");
const errors = require("../helpers/errors/errors");
const jwt = require("jsonwebtoken");
const secretKey = require("../helpers/db/config.secret");
class UserService {
    constructor({ firstName, lastName, birthDate, image, credentialId ,role}) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.birthDate = birthDate;
        this.image = image;
        this.credentialId = credentialId;
        this.role = role;
    }
    async add() {
        const user = new User({
            firstName: this.firstName,
            lastName: this.lastName,
            image: this.image,
            birthDate: Date.parse(this.birthDate),
            credentialId: this.credentialId,
            role : this.role
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
    async getProfile(id){
        return await User.findById(id).populate([{ path: 'credentials', strictPopulate: false }]).exec();
    }
}

module.exports = UserService;