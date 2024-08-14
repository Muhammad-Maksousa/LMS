const AdminService = require("../services/admin");
const CredentialService = require("../services/credential");
const Roles = require("../helpers/roles");
const {responseSender,updateResponseSender,ResponseSenderWithToken} = require("../helpers/wrappers/response-sender");
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
        updateResponseSender(res,'admin');
    },
    login:async (req,res)=>{
        const {body} = req;
        const credential = await new CredentialService({ ...body }).login();
        const admin = await new AdminService({}).login(credential);
        ResponseSenderWithToken(res, admin.info, admin.token);
    }
    
}