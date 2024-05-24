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
        const { UserId } = req;
        const { body } = req;
        if (req.file)
            body.image = req.file.filename;
        if (body.password || body.email){
            const user = await new UserService({}).getProfile(UserId);
            await new CredentialService({ ...body }).changePassword(user.credentialId);
        }
        const updateedUser = await new UserService({ ...body }).update(UserId);
        updateResponseSender(res, 'User');
    },
    login: async (req, res) => {
        const { body } = req;
        const credential = await new CredentialService({ ...body }).login();
        const user = await new UserService({}).login(credential);
        ResponseSenderWithToken(res, user.info, user.token);
    },
    enroll: async (req, res) => {
        const { courseId} = req.params;
        const { userId } = req;
        const user = await new UserService({}).enroll(courseId, userId);
        responseSender(res, user);
    },
    getMyEnrolledCourses:async (req,res)=>{
        const { userId } = req;
        const enrolledCourses = await new UserService({}).getMyEnrolledCourses(userId);
        responseSender(res, enrolledCourses);
    },
    finishedCourse: async (req, res) => {
        const { courseId } = req.params;
        const { userId } = req;
        const user = await new UserService({}).finishCourse(courseId, userId);
        responseSender(res, user);
    },
    getMyFinishedCourses:async (req,res)=>{
        const { userId } = req;
        const finishedCourses = await new UserService({}).getMyFinishedCourses(userId);
        responseSender(res, finishedCourses);
    },
    getProfile: async (req, res) => {
        const { userId } = req;
        const user = await new UserService({}).getProfile(userId);
        responseSender(res, user);
    },
    addToWishList: async (req, res) => {
        const { courseId } = req.params;
        const { userId } = req;
        const wishlist = await new UserService({}).addToWishList(userId, courseId);
        responseSender(res, wishlist);
    },
    deleteFromWishList: async (req, res) => {
        const { courseId } = req.params;
        const { userId } = req;
        const wishlist = await new UserService({}).deleteFromWishList(userId, courseId);
        responseSender(res, wishlist);
    },
    getWishList: async (req, res) => {
        const { userId } = req;
        const wishlist = await new UserService({}).getWishList(userId);
        responseSender(res, wishlist);
    }

}