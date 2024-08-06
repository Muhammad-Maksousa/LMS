const InstituteService = require("../services/Institute");
const CredentialService = require("../services/credential");
const JoinRequistsService = require("../services/joinRequists");
const moment = require("moment");
const Roles = require("../helpers/roles");
const { responseSender, updateResponseSender, ResponseSenderWithToken } = require("../helpers/wrappers/response-sender");
module.exports = {
    add: async (req, res) => {
        let { body } = req;
        body.role = Roles.Institute;
        const credential = await new CredentialService({ ...body }).add();
        body.credentialId = credential._id;
        if (req.file) body.image = req.file.filename;
        const institute = await new InstituteService({ ...body }).add();
        responseSender(res, institute);
    },
    update: async (req, res) => {
        const { instituteId } = req.params;
        const { body } = req;
        if (req.file) body.image = req.file.filename;
        if (body.password || body.email) {
            const institute = await new InstituteService({}).getProfile(teacherId);
            await new CredentialService({ ...body }).changeCredential(institute.credentialId);
        }
        const updatedInstitute = await new InstituteService({ ...body }).update(instituteId);
        updateResponseSender(res, "teacher");
    },
    login: async (req, res) => {
        const { body } = req;
        const credential = await new CredentialService({ ...body }).login();
        const user = await new InstituteService({}).login(credential);
        ResponseSenderWithToken(res, user.info, user.token);
    },
    getProfile: async (req, res) => {
        const { id } = req.params;
        const institute = await new InstituteService({}).getProfile(id);
        responseSender(res, institute);
    },
    getAll: async (req, res) => {
        const institute = await new InstituteService({}).getAll();
        responseSender(res, institute);
    },
    acceptTeacherByAdmin: async (req, res) => {
        const { body } = req;
        const { instituteId } = req;
        body.startDate = moment(body.startDate, "DD/MM/YYYY");
        body.endDate = moment(body.endDate, "DD/MM/YYYY");
        const resulte = await new InstituteService({}).acceptTeacher(instituteId, body.teacherId,body.startDate,body.endDate);
        await new JoinRequistsService({}).removeTeacherToInstituteRequist(instituteId,body.teacherId);
        responseSender(res, resulte);
    },
    teacherToinstituteRequists:async (req,res)=>{
        const { instituteId } = req;
        const resulte = await new JoinRequistsService({}).getTeacherToInstituteRequists(instituteId);
        responseSender(res,resulte);
    },
    getMyTeachers:async(req,res)=>{
        const {instituteId} = req;
        const resulte = await new InstituteService({}).getMyTeachers(instituteId);
        responseSender(res,resulte);
    }
};