const AdminService = require("../services/admin");
const CredentialService = require("../services/credential");
const TeacherService = require('../services/teacher');
const NotificationService = require("../services/notification");
const Roles = require("../helpers/roles");
const { responseSender, updateResponseSender, ResponseSenderWithToken } = require("../helpers/wrappers/response-sender");
const { response } = require("express");
const JoinRequists = require("../models/joinRequists");
const Admin = require("../models/admin");
module.exports = {
    add: async (req, res) => {
        const { body } = req;
        body.role = Roles.admin;
        const credential = await new CredentialService({ ...body }).add();
        body.credentialId = credential._id;
        const admin = await new AdminService({ ...body }).add();
        responseSender(res, admin)
    },
    update: async (req, res) => {
        const { body } = req;
        const { adminId } = req;
        const admin = await new AdminService({}).getProfile(adminId);
        await new CredentialService({ ...body }).changeCredential(admin.credentialId);
        updateResponseSender(res, 'admin');
    },
    login: async (req, res) => {
        const { body } = req;
        const credential = await new CredentialService({ ...body }).login();
        const admin = await new AdminService({}).login(credential);
        ResponseSenderWithToken(res, admin.info, admin.token);
    },
    acceptTeacher: async (req, res) => {
        const { teacherId } = req.params;
        const teacher = await new TeacherService({}).acceptedByAdmin(teacherId);
        // let notification = { 'notification': { title: "Admin Response to Your join requist", body: "you have been Accepted, You Can Start Creating Courses." } };
        // await new NotificationService({}).sendNotificationToTeacher(teacher.fcm, notification);
        responseSender(res, "the teacher accept successfully ");
    },
    rejectTeacher:async(req,res)=>{
        const { teacherId } = req.params;
        const msg = req.body.message
        const teacher = await new TeacherService({}).rejectedByAdmin(teacherId,msg);
        // let notification = { 'notification': { title: "Institute reply to your join requist", body: "you have been Rejected Check your mailBox to know why." }};
        // await new NotificationService({}).sendNotificationToTeacher(teacher.fcm, notification);
        responseSender(res, "the teacher rejected successfully");
    },
    getAllTeacher:async(req,res)=>{
        const result = await JoinRequists.find({}, { 'teacherToPlatform': 1 })
        .populate({
          path: 'teacherToPlatform.teacherId', // Populate teacherId from teacherToPlatform
          select: 'firstName lastName subject' // Select only firstName, lastName, and subject fields
        })
        responseSender(res,result)
    },
    getProfile:async(req,res)=>{
        const {adminId} = req 
        const result = await Admin.findById(adminId)
        responseSender(res,result)
    }

}