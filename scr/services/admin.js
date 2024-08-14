const Admin = require("../models/admin");
class AdminService{
    constructor({name,image,credentialId}){
        this.name = name;
        this.image = image;
        this.credentialId = credentialId;
    };
    async add(){
        let admin = new Admin({
            name:this.name,
            image:this.image,
            credentialId:this.credentialId
        });
        return await admin.save();
    };
    async login(cred) {
        const admin = await Admin.findOne({ credentialId: cred._id }).populate("credentialId");
        let token = jwt.sign({ adminId: admin._id, role: cred.role }, secretKey, { expiresIn: "30 days" });
        return { info: admin, token: token };
    }
}
module.exports = AdminService;