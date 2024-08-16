const Teacher = require("../models/teacher");
const Institute = require("../models/institute");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const secretKey = require("../helpers/db/config.secret");
const JoinRequists=require("./../models/joinRequists")
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
    async changeStatusByAdmin(teacherId, status) {
        return await Teacher.findByIdAndUpdate(teacherId, { status: status }, { new: true });
    }
    async getAll() {
        return await Teacher.find();
    }
    async getmyInstitutes(teacherId) {
        return await Institute.find({ "teachers.teacherId": teacherId });
    }
    async getAllMessage(teacherId) {
        return await Teacher.findById(teacherId).select("messages")
    }
    async getMessage(teacherId, messageId) {
        const teacher = await Teacher.findById(teacherId)
        const message = teacher.messages.find(msg => msg._id.toString() === messageId)
        return message
    }
    async deleteMessage(teacherId, messageId) {
        const objectId = new mongoose.Types.ObjectId(messageId);
        return await Teacher.findByIdAndUpdate(teacherId, { $pull: { messages: { _id: objectId } } })
    }
    async acceptedByAdmin(id) {
        return await Teacher.findByIdAndUpdate(id, { status: 'accepted' }, { new: true });
    }
    async rejectedByAdmin(id,msg) {
        let message = {
            instituteName:"admin",
            theMessage:msg
        }
        return await Teacher.findByIdAndUpdate(id, { status: 'rejected',$push:{messages:message}} , { new: true });
    }
    async getMyPendingRequest(id){
        return await JoinRequists.find(
            {
              "teacherToInstitute.teacherId": id,
            },
            {
              _id: 0, // Exclude the _id field from the results
              "teacherToInstitute.instituteId": 1, // Include only the instituteId in the output
            }
          ).populate({
            path: "teacherToInstitute.instituteId",
            select: "name", 
          });
    }
    async updateWallet(id,cost){
        let teacher = Teacher.findById(id);
        return await Teacher.findByIdAndUpdate(id,{wallet:teacher.wallet+cost});
      }
}

module.exports = TeacherService;