const CredentialService = require("../services/credential");
const UserService = require("../services/user");
const { responseSender, updateResponseSender } = require("../helpers/wrappers/response-sender");
const moment = require('moment');

module.exports = {
    add: async (req, res) => {
        const { body } = req;
        const credential = await new CredentialService({ ...body }).add();
        body.credentialId = credential._id;
        if (body.birthDate)
            body.birthDate = moment(body.birthDate, "DD/MM/YYYY");
        const user = await new UserService({ ...body }).add();
        responseSender(res, user);
    },
    update: async (req, res) => {
        const { id } = req.query;
        const { body } = req;
        if (body.password)
            await new CredentialService({ ...body }).changePassword(id);
        const updateedUser = await new UserService({ ...body }).update(id);
        console.log(updateedUser);
        updateResponseSender(res, 'User');
    }
}