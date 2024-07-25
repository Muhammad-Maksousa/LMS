const Teacher = require("../models/teacher");

class TeacherService {
    constructor(credentialId, firstName, lastName, image, cv, subject, summery, socialMediaAccounts, wallet) {
        this.credentialId = credentialId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.image = image;
        this.cv = cv;
        this.subject = subject;
        this.summery = summery;
        this.socialMediaAccounts = socialMediaAccounts;
        this.wallet = wallet;
    }
    async add() {
        const teacher = new Teacher({
            credentialId: this.credentialId,
            firstname: this.firstName,
            lastName: this.lastName,
            image: this.image,
            CV: this.cv,
            subject: this.subject,
            summery: this.summery,
            socialMediaAccounts: this.socialMediaAccounts,
            wallet: 0,
            status:"pending"
        });
        return await teacher.save();
    }
    async update(id) {
        return await Teacher.findByIdAndUpdate(id, {
            firstname: this.firstName,
            lastName: this.lastName,
            image: this.image,
            CV: this.cv,
            subject: this.subject,
            summery: this.summery,
            socialMediaAccounts: this.socialMediaAccounts
        });
    }
    async login(cred) {
        const teacher = await Teacher.findOne({ credentialId: cred._id }).populate("credentialId");
        let token = jwt.sign({ userId: user._id, role: cred.role }, secretKey, {expiresIn: "30 days"});
        return { info: teacher, token: token };
      }
    async getProfile(id) {
        return await Teacher.findById(id).populate("credentialId");
    }
    async approvedByAdmin(teacherId){
        return await Teacher.findByIdAndUpdate(teacherId,{status:"Active"},{new:true});
    }
}

module.exports = TeacherService;