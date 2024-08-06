const JoinRequists = require("../models/joinRequists");
class JoinRequistsService {
    async teacherToInstitute(teacherId, instituteId) {
        const joinrequist = new JoinRequists({
            teacherToInstitute: {
                teacherId: teacherId,
                instituteId: instituteId,
            }
        });
        return await joinrequist.save();
    };
    async teacherToPlatform(teacherId) {
        const joinrequist = new JoinRequists({
            teacherToPlatform: {
                teacherId: teacherId
            }
        });
        return await joinrequist.save();
    };
    async userToInstitute(userId, instituteId) {
        const joinrequist = new JoinRequists({
            userToInstitute: {
                userId: userId,
                instituteId: instituteId
            }
        });
        return await joinrequist.save();
    };
    async getTeacherToInstituteRequists(instituteId){
        return await JoinRequists.find({"teacherToInstitute.instituteId":instituteId}).populate("teacherToInstitute.teacherId").populate("teacherToInstitute.instituteId");
    };
    async removeTeacherToInstituteRequist(instituteId,teacherId){
        return await JoinRequists.findOneAndDelete({"teacherToInstitute.instituteId":instituteId,"teacherToInstitute.teacherId":teacherId});
    }
}
module.exports = JoinRequistsService;