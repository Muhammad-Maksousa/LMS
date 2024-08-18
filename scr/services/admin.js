const Admin = require("../models/admin");
const jwt = require("jsonwebtoken");
const secretKey = require("../helpers/db/config.secret");
const CustomError = require("../helpers/errors/custom-errors");
const errors = require("../helpers/errors/errors.json");
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
        try {
            return await Admin.findByIdAndUpdate('66bcbf9b3ac09343f4ed77f3',{$inc:{wallet:cost}});   
        } catch (error) {
            console.log(error);
            throw new CustomError(errors.You_Can_Not_Do_This);
        }
    };
}
module.exports = AdminService;