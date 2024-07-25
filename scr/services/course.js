const Course = require("./../models/course");
const mongoose = require("mongoose");
class CourseService {
    async rate(info) {
        let newRate = {
            userId: info.userId,
            rate: info.rate,
            comment: info.comment
        };
        return await Course.findByIdAndUpdate(info.courseId, { $push: { ratings: newRate } }, { new: true });
    }
    async updateRate(courseId) {
        let res = await Course.aggregate([{ $unwind: "$ratings" }, { $group: { _id: courseId, rate: { $avg: "$ratings.rate" } } }]);
        return await Course.findByIdAndUpdate(courseId, { rate: res[0].rate }, { new: true });
    }
    async getAllCoursesByTeacherId(teacherId){
        return await Course.find({Teacher_ID:{$in:[teacherId]}});
    }
}
module.exports = CourseService;