const Credential = require('../models/credential');
const CustomError = require("../helpers/errors/custom-errors");
const errors = require("../helpers/errors/errors.json");
const bcrypt = require("bcryptjs");
class CredentialService {
    constructor({ email, password, role }) {
        this.email = email;
        this.password = password;
        this.role = role;
    }
    async add() {
        const credential = await new Credential({
            email: this.email,
            password: bcrypt.hashSync(this.password, 8),
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
    async login(){
        const cred = await Credential.findOne({email:this.email});
        let passwordIsValid = bcrypt.compareSync(this.password,cred.password);
        if(!passwordIsValid)
            throw new CustomError(errors.Validation_Error);
        return cred;
    }

}

module.exports = CredentialService;