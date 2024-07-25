const TeacherService = require("../services/teacher");
const CredentialService = require("../services/credential");
const { responseSender, updateResponseSender, ResponseSenderWithToken } = require("../helpers/wrappers/response-sender");
module.exports = {
    add: async (req, res) => {
        const { body } = req;
        console.log(body.socialMediaAccounts[0]);/*
        const credential = await new CredentialService({ ...body }).add();
        body.credentialId = credential._id;
        if (req.files){
            body.image = req.files[0].filename;
            body.cv = req.files[1].filename;
        }
        const teacher = await new TeacherService({ ...body }).add();*/
        responseSender(res, teacher);
    },
    update: async (req, res) => {
        const { teacherId } = req;
        const { body } = req;
        if (req.file) body.image = req.file.filename;
        if (body.password || body.email) {
            const teacher = await new TeacherService({}).getProfile(teacherId);
            await new CredentialService({ ...body }).changePassword(teacher.credentialId);
        }
        const updatedTeacher = await new TeacherService({ ...body }).update(teacherId);
        updateResponseSender(res, "teacher");
    },
    login: async (req, res) => {
        const { body } = req;
        const credential = await new CredentialService({ ...body }).login();
        const user = await new TeacherService({}).login(credential);
        ResponseSenderWithToken(res, user.info, user.token);
    },
    getProfile:async (req,res)=>{
        const {teacherId} = req.params;
        const Teacher = await new TeacherService({}).getProfile(teacherId);
        responseSender(res,Teacher);
    }
};