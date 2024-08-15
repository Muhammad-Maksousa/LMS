const Community = require("../models/community");
const User = require("../models/user");
const Teacher = require("../models/teacher");
const AuthSocket = require("../middleware/authForSocket");
class CommunityService {
     async send (socket, msg) {
        const user =  await new AuthSocket().UserToken(msg.token);
        const teacher = await new AuthSocket().verifyTeacherToken(msg.token);
        let senderName;
        if (!user)
            senderName = teacher;
        else
            senderName = user;
        let message = {
            senderName: senderName,
            message: msg.message,
            courseId: msg.courseId
        }
        await Community.create(message);
        const community = await Community.find({ courseId: msg.courseId });
        socket.emit("Communtiy updated", { data: community })
    };
    async getChat(socket,msg){
        const community = await Community.find({ courseId: msg.courseId });
        socket.emit("Communtiy updated", { data: community })
    }
};
module.exports = CommunityService;