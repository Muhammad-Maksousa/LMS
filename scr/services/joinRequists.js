const JoinRequists = require("../models/joinRequists");
class JoinRequistsService {
  async teacherToInstitute(teacherId, instituteId) {
    const joinrequist = new JoinRequists({
      teacherToInstitute: {
        teacherId: teacherId,
        instituteId: instituteId,
      },
    });
    return await joinrequist.save();
  }
  async teacherToPlatform(teacherId) {
    const joinrequist = new JoinRequists({
      teacherToPlatform: {
        teacherId: teacherId,
      },
    });
    return await joinrequist.save();
  }
  async userToInstituteByGrant(userId, instituteId, scholarshipId) {
    // Find the document that matches both instituteId and scholarshipId
    const existingEntry = await JoinRequists.findOne({
      "userToInstituteByGrant.instituteId": instituteId,
      "userToInstituteByGrant.scholarshipId": scholarshipId,
    });

    if (existingEntry) {
      // Check if the userId already exists in the array
      if (!existingEntry.userToInstituteByGrant.userId.includes(userId)) {
        // Add userId to the array and save the document
        existingEntry.userToInstituteByGrant.userId.push(userId);
        await existingEntry.save();
        return true;
      } else {
        // User has already registered for the scholarship
        return false;
      }
    } else {
      // If no entry exists, create a new one
      const newJoinRequest = new JoinRequists({
        userToInstituteByGrant: {
          instituteId: instituteId,
          scholarshipId: scholarshipId,
          userId: [userId],
        },
      });
      await newJoinRequest.save();
      return true;
    }
  }
  async getTeacherToInstituteRequists(instituteId) {
    return await JoinRequists.find({
      "teacherToInstitute.instituteId": instituteId,
    })
      .populate("teacherToInstitute.teacherId")
      .populate("teacherToInstitute.instituteId");
  }
  async removeTeacherToInstituteRequist(instituteId, teacherId) {
    return await JoinRequists.findOneAndDelete({
      "teacherToInstitute.instituteId": instituteId,
      "teacherToInstitute.teacherId": teacherId,
    });
  }
  async removeCourseToInstituteRequist(instituteId,courseId) {
    return await JoinRequists.findOneAndDelete({
      "courseToInstitute.instituteId": instituteId,
      "courseToInstitute.courseId": courseId,
    });
  }
  async getScholarshipRequests(instituteId, scholarshipId) {
    const result = await JoinRequists.find({
      "userToInstituteByGrant.instituteId": instituteId,
      "userToInstituteByGrant.scholarshipId": scholarshipId,
    }).populate("userToInstituteByGrant.userId");

    return result;
  }
  async remveUserToInstituteByGrant(instituteId, scholarshipId, userId) {
    return await JoinRequists.findOneAndUpdate(
      {
        "userToInstituteByGrant.instituteId": instituteId,
        "userToInstituteByGrant.scholarshipId": scholarshipId
      },
      {
        $pull: { "userToInstituteByGrant.userId": userId }
      },
      { new: true }
    );
  };
  async addCourse(instituteId, courseId) {
    const joinrequist = new JoinRequists({
      courseToInstitute: {
        instituteId: instituteId,
        courseId: courseId
      }
    });
    return await joinrequist.save();
  };
  async getAllCoursesRequists(instituteId){
    return await JoinRequists.find({"courseToInstitute.instituteId":instituteId}); 
  };
}
module.exports = JoinRequistsService;
