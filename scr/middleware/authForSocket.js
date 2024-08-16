let jwt = require('jsonwebtoken');
const secretKey = require("../helpers/db/config.secret");
const CustomError = require("../helpers/errors/custom-errors");
const errors = require("../helpers/errors/errors.json");
const UserService = require('../services/user');
const TeacherService = require('../services/teacher');
class AuthSocket {
    async UserToken(token) {
        let user;
        await jwt.verify(token, secretKey, async (err, decoded) => {
            if (err)
                throw new CustomError(errors.Internal_Server_Error);
            user = await new UserService({}).getProfile(decoded.userId);
        });
        if (!user)
            return null
        return user.firstName + ' ' + user.lastName;
    };
    async verifyTeacherToken(token) {
        let teacher;
        await jwt.verify(token, secretKey, async (err, decoded) => {
            if (err)
                throw new CustomError(errors.Internal_Server_Error);
            teacher = await new TeacherService({}).getProfile(decoded.teacherId);
        });
        if (!teacher)
            return null;
        return teacher.firstName + ' ' + teacher.lastName;
    };
}
module.exports = AuthSocket;