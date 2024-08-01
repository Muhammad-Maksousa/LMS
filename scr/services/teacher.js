const Teacher = require("../models/teacher");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const secretKey = require("../helpers/db/config.secret");
class TeacherService {
    constructor({ credentialId, firstName, lastName, image, cv, subject, summery, socialMediaAccounts }) {
        this.credentialId = credentialId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.image = image;
        this.cv = cv;
        this.subject = subject;
        this.summery = summery;
        this.socialMediaAccounts = socialMediaAccounts;
    }
    async add() {
        const teacher = new Teacher({
            credentialId: this.credentialId,
            firstName: this.firstName,
            lastName: this.lastName,
            image: this.image,
            CV: this.cv,
            subject: this.subject,
            summery: this.summery,
            socialMediaAccounts: this.socialMediaAccounts,
            wallet: 0,
            status: "pending"
        });
        return await teacher.save();
    }
    async update(id) {
        return await Teacher.findByIdAndUpdate(id, {
            firstName: this.firstName,
            lastName: this.lastName,
            image: this.image,
            CV: this.cv,
            subject: this.subject,
            summery: this.summery,
            socialMediaAccounts: this.socialMediaAccounts
        });
    }
    async login(cred) {
        const teacher = await Teacher.findOne({ credentialId: cred._id }).populate("credentialId");
        let token = jwt.sign({ teacherId: teacher._id, role: cred.role }, secretKey, { expiresIn: "30 days" });
        return { info: teacher, token: token };
    }
    async getProfile(id) {
        return await Teacher.findById(id).populate("credentialId");
    }
    async changeStatusByAdmin(teacherId,status) {
        return await Teacher.findByIdAndUpdate(teacherId, { status: status }, { new: true });
    }
    async getAll() {
        return await Teacher.find();
    }
}

module.exports = TeacherService;