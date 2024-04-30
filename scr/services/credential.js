const db = require('../models');
const Credential = db.credentials;
const CustomError = require("../helpers/errors/custom-errors");
const errors = require("../helpers/errors/errors");
class CredentialService {
    constructor({ email, password, role }) {
        this.email = email;
        this.password = password;
        this.role = role;
    }
    async add() {
        const credential = new Credential({
            email: this.email,
            password: this.password,
            role: this.role
        });
        return await credential.save();
    }
    async changePassword(id) {
        return await Credential.findOneAndUpdate({ _id: id }, {
            email: this.email,
            password: this.password
        }, { new: true });
    }

}

module.exports = CredentialService;