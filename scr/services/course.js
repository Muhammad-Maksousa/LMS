const Course = require("./../models/course");
const mongoose = require("mongoose");
const CustomError = require("../helpers/errors/custom-errors");
const errors = require("../helpers/errors/errors.json");
class CourseService {
    async rate(info) {
        let newRate = {
            userId: info.userId,
            rate: info.rate,
            comment: info.comment
        };
        const alreadyRate = await Course.findOne({"ratings.userId":info.userId,"_id":info.courseId});
        if(alreadyRate)
            throw new CustomError(errors.You_Can_Not_Do_This);
        return await Course.findByIdAndUpdate(info.courseId, { $push: { ratings: newRate } }, { new: true });
    }
    async updateRate(courseId) {
        let res = await Course.aggregate([{ $unwind: "$ratings" }, { $group: { _id: courseId, rate: { $avg: "$ratings.rate" } } }]);
        return await Course.findByIdAndUpdate(courseId, { rate: res[0].rate }, { new: true });
    }
    async getAllCoursesByTeacherId(teacherId){
        return await Course.find({Teacher_ID:{$in:[teacherId]}});
    }
    async getAllUsersOfCourse(id){
        return await Course.findById(id).populate("users.enrolledCourses");// tryimg to get a course and all users enrolled in it
    }
}
module.exports = CourseService;