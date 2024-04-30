const db = require('../models');
const User = db.users;
const CustomError = require("../helpers/errors/custom-errors");
const errors = require("../helpers/errors/errors");
class UserService {
    constructor({ firstName, lastName, birthDate, image, credentialId }) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.birthDate = birthDate;
        this.image = image;
        this.credentialId = credentialId;
    }
    async add() {
        const user = new User({
            firstName: this.firstName,
            lastName: this.lastName,
            image: this.image,
            birthDate: Date.parse(this.birthDate),
            credentialId: this.credentialId
        });
        return await user.save();
    }
    async update(id) {
        return User.findOneAndUpdate({ _id: id }, {
            firstName: this.firstName,
            lastName: this.lastName,
            image: this.image,
            birthDate: Date.parse(this.birthDate)
        }, { new: true });
    }

}

module.exports = UserService;