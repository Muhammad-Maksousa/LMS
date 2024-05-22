const CredentialService = require("../services/credential");
const UserService = require("../services/user");
const { responseSender, updateResponseSender, ResponseSenderWithToken } = require("../helpers/wrappers/response-sender");
const moment = require('moment');

module.exports = {
    add: async (req, res) => {
        const { body } = req;
        const credential = await new CredentialService({ ...body }).add();
        body.credentialId = credential._id;
        if (req.file)
            body.image = req.file.filename;
        if (body.birthDate)
            body.birthDate = moment(body.birthDate, "DD/MM/YYYY");
        const user = await new UserService({ ...body }).add();
        responseSender(res, user);
    },
    update: async (req, res) => {
        const { id } = req.params;
        const { body } = req;
        if (req.file)
            body.image = req.file.filename;
        if (body.password || body.email)
            await new CredentialService({ ...body }).changePassword(id);
        const updateedUser = await new UserService({ ...body }).update(id);
        updateResponseSender(res, 'User');
    },
    login: async (req, res) => {
        const { body } = req;
        const credential = await new CredentialService({ ...body }).login();
        const user = await new UserService({}).login(credential);
        ResponseSenderWithToken(res, user.info, user.token);
    },
    enroll: async (req, res) => {
        const { courseId, userId } = req.query;
        const user = await new UserService({}).enroll(courseId, userId);
        responseSender(res, user);
    },
    finishedCourse: async (req, res) => {
        const { courseId, userId } = req.query;
        const user = await new UserService({}).finishCourse(courseId, userId);
        responseSender(res, user);
    },
    getProfile:async (req,res)=>{
        const {id} = req.params;
        const user = await new UserService({}).getProfile(id);
        responseSender(res,user);
    }

}