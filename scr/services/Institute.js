const Institute = require("../models/institute");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const secretKey = require("../helpers/db/config.secret");
class InstituteService {
  constructor({ credentialId, name, image, socialMediaAccounts }) {
    this.credentialId = credentialId;
    this.name = name;
    this.image = image;
    this.socialMediaAccounts = socialMediaAccounts;
  }
  async add() {
    const institute = new Institute({
      credentialId: this.credentialId,
      name: this.name,
      image: this.image,
      socialMediaAccounts: this.socialMediaAccounts,
    });
    return await institute.save();
  }
  async update(id, updateData) {
    return await Institute.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }
  async login(cred) {
    const institute = await Institute.findOne({
      credentialId: cred._id,
    }).populate("credentialId");
    let token = jwt.sign(
      { instituteId: institute._id, role: cred.role },
      secretKey,
      { expiresIn: "30 days" }
    );
    return { info: institute, token: token };
  }
  async getProfile(id) {
    return await Institute.findById(id).populate("credentialId");
  }
  async getAll() {
    return await Institute.find();
  }
}

module.exports = InstituteService;
