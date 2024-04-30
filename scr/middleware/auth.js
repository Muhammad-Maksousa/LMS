/*let jwt = require('jsonwebtoken');
const secretKey = require("../helpers/db/config.secret");
const CustomError = require("../helpers/errors/custom-errors");
const errors = require("../helpers/errors/errors.json");
const User = require("../models/user");
const Role = require("../helpers/roles");
const StorageAdminService = require('../services/storageAdmin');
const UserService = require('../services/user');
verifyUserToken = async (req, res, next) => {
    let token = req.headers.authorization;
    if (!token)
        throw new CustomError(errors.No_Token_Provided);
    await jwt.verify(token, secretKey, async (err, decoded) => {
        if (err)
            throw new CustomError(errors.Internal_Server_Error);
        const user = await new UserService({}).getById(decoded.userId);
        if (!user)
            throw new CustomError(errors.Not_Authorized);
        req.userId = user.id;
        req.userRole = user.role;
        next();
    });
};
verifyAdminToken = async (req, res, next) => {
    let token = req.headers.authorization;
    if (!token)
        throw new CustomError(errors.No_Token_Provided);
    await jwt.verify(token, secretKey, async (err, decoded) => {
        if (err)
            throw new CustomError(errors.Internal_Server_Error);
        const user = await new UserService({}).getById(decoded.userId);
        if (user.role === Role.user)
            throw new CustomError(errors.Not_Authorized);
        else if (user.role === Role.superAdmin) {
            req.userId = user.id;
            req.role = user.role;
            next();
        } else {
            const storageAdmin = await new StorageAdminService({}).getAdmin(user.id);
            req.user = user.id;
            req.role = user.role;
            req.storageId = storageAdmin.storageId;
            next();
        }
    });
};
module.exports = {
    verifyUserToken: verifyUserToken,
    verifyAdminToken: verifyAdminToken,
};*/