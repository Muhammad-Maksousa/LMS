const Institute = require("../models/institute");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const secretKey = require("../helpers/db/config.secret");
class InstituteService {
    constructor({ credentialId, name, image, socialMediaAccounts,teachers,location}) {
        this.credentialId = credentialId;
        this.name = name;
        this.image = image;
        this.socialMediaAccounts = socialMediaAccounts;
        this.teachers = teachers;
        this.location = location;
    }
    async add() {
        const institute = new Institute({
            credentialId: this.credentialId,
            name: this.name,
            image: this.image,
            socialMediaAccounts: this.socialMediaAccounts,
            teachers:this.teachers,
            location:this.location,
            wallet:this.wallet
        });
        return await institute.save();
    }
    async update(id, updateData) {
        if (typeof updateData !== 'object' || Array.isArray(updateData)) {
          throw new Error('Invalid data format for update');
        }
    
        const updatedInstitute = await Institute.findByIdAndUpdate(id, updateData, {
          new: true,
          runValidators: true,
        });
    
        if (!updatedInstitute) {
          console.error(`No Institute found with ID: ${id}`);
          return null;
        }
    
        return updatedInstitute;
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
