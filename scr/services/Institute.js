const Institute = require("../models/institute");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const secretKey = require("../helpers/db/config.secret");
class InstituteService {
    constructor({ credentialId, name, image, socialMediaAccounts,teachers}) {
        this.credentialId = credentialId;
        this.name = name;
        this.image = image;
        this.socialMediaAccounts = socialMediaAccounts;
        this.teachers = teachers;
    }
    async add() {
        const institute = new Institute({
            credentialId: this.credentialId,
            name: this.name,
            image: this.image,
            socialMediaAccounts: this.socialMediaAccounts,
            teachers:this.teachers
        });
        return await institute.save();
    }
    async update(id) {
        return await Institute.findByIdAndUpdate(id, {
            name: this.name,
            image: this.image,
            socialMediaAccounts: this.socialMediaAccounts
        });
    }
    async login(cred) {
        const institute = await Institute.findOne({ credentialId: cred._id }).populate("credentialId");
        let token = jwt.sign({ instituteId: institute._id, role: cred.role }, secretKey, { expiresIn: "30 days" });
        return { info: institute, token: token };
    }
    async getProfile(id) {
        return await Institute.findById(id).populate("credentialId");
    }
    async getAll() {
        return await Institute.find();
    }
    async acceptTeacher(instituteId,teacherId,startDate,endDate){
        let teacher = {
            teacherId:teacherId,
            startDate:startDate,
            endDate:endDate
        }
        return await Institute.findByIdAndUpdate(instituteId,{ $push: { teachers: teacher } },{ new: true });
    };
    async getMyTeachers(instituteId){
        return await Institute.findById(instituteId).populate("teachers.teacherId").select("teachers");
    };
}

module.exports = InstituteService;