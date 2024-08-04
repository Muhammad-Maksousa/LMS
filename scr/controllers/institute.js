const InstituteService = require("../services/Institute");
const CredentialService = require("../services/credential");
const Roles = require("../helpers/roles");
var mongoose = require("mongoose");
const {
  responseSender,
  updateResponseSender,
  ResponseSenderWithToken,
} = require("../helpers/wrappers/response-sender");
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
    const { id: instituteId } = req.params;
    const { body } = req;

    if (req.file) body.image = req.file.filename;

    if (body.password || body.email) {
      const institute = await new InstituteService({}).getProfile(instituteId);
      await new CredentialService(body).changeCredential(institute.credentialId);
    }

    const updatedInstitute = await new InstituteService({}).update(instituteId, body);
    updateResponseSender(res, "Institute");
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
};
