const Admin = require("../models/admin");
const jwt = require("jsonwebtoken");
const secretKey = require("../helpers/db/config.secret");
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
    };
    async getProfile(id){
        return await Admin.findById(id).populate("credentialId");
    };
    async updateWallet(cost){
        let admin = Admin.findById(id);//TODO we have one Admin so get his ID
        return await Admin.findByIdAndUpdate(id,{wallet:admin.wallet+cost});
    };
}
module.exports = AdminService;