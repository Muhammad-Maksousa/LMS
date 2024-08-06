const TeacherService = require("../services/teacher");
const CredentialService = require("../services/credential");
const JoinRequistsService = require("../services/joinRequists");
const Roles = require("../helpers/roles");
var mongoose = require('mongoose');
const { responseSender, updateResponseSender, ResponseSenderWithToken } = require("../helpers/wrappers/response-sender");
module.exports = {
    add: async (req, res) => {
        let { body } = req;
        body.role = Roles.teacher;
        const credential = await new CredentialService({ ...body }).add();
        body.credentialId = credential._id;
        //body.image = "1722006849364.png";
        //body.cv =  "1722006849364.png";
        if (req.files) {
            req.files.forEach(file => {
                if (file.fieldname == 'image')
                    body.image = file.filename;
                if (file.fieldname == 'cv')
                    body.cv = file.filename;
            });
        }
        const teacher = await new TeacherService({ ...body }).add();
        await new JoinRequistsService({}).teacherToPlatform(teacher.id);
        responseSender(res, teacher);
    },
    update: async (req, res) => {
        const { teacherId } = req;
        const { body } = req;
        if (req.files) {
            req.files.forEach(file => {
                if (file.fieldname == 'image')
                    body.image = file.filename;
                if (file.fieldname == 'cv')
                    body.cv = file.filename;
            });
        }
        if (body.password || body.email) {
            const teacher = await new TeacherService({}).getProfile(teacherId);
            await new CredentialService({ ...body }).changeCredential(teacher.credentialId);
        }
        const updatedTeacher = await new TeacherService({ ...body }).update(teacherId);
        updateResponseSender(res, "teacher");
    },
    login: async (req, res) => {
        const { body } = req;
        const credential = await new CredentialService({ ...body }).login();
        const teacher = await new TeacherService({}).login(credential);
        ResponseSenderWithToken(res, teacher.info, teacher.token);
    },
    getProfile: async (req, res) => {
        const { id } = req.params;
        console.log("teacherId " + id);
        const Teacher = await new TeacherService({}).getProfile(id);
        responseSender(res, Teacher);
    },
    getAll: async (req, res) => {
        const teachers = await new TeacherService({}).getAll();
        responseSender(res, teachers);
    },
    joinToInstitute: async (req, res) => {
        const { teacherId } = req;
        const { instituteId } = req.params;
        await new JoinRequistsService({}).teacherToInstitute(teacherId, instituteId);
        responseSender(res, "Your Requist Has Been Sent");
    }
};