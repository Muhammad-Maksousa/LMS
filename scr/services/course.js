const Course = require("./../models/course");
const mongoose = require("mongoose");
const CustomError = require("../helpers/errors/custom-errors");
const errors = require("../helpers/errors/errors.json");
class CourseService {
<<<<<<< HEAD
  async rate(info) {
    let newRate = {
      userId: info.userId,
      rate: info.rate,
      comment: info.comment,
    };
    const alreadyRate = await Course.findOne({
      "ratings.userId": info.userId,
      _id: info.courseId,
    });
    if (alreadyRate) throw new CustomError(errors.You_Can_Not_Do_This);
    return await Course.findByIdAndUpdate(
      info.courseId,
      { $push: { ratings: newRate } },
      { new: true }
    );
  }
  async updateRate(courseId) {
    let res = await Course.aggregate([
      { $unwind: "$ratings" },
      { $group: { _id: courseId, rate: { $avg: "$ratings.rate" } } },
    ]);
    return await Course.findByIdAndUpdate(
      courseId,
      { rate: res[0].rate },
      { new: true }
    );
  }
  async getAllCoursesByTeacherId(teacherId) {
    return await Course.find({ Teacher_ID: { $in: [teacherId] } });
  }
  async getAllUsersOfCourse(id) {
    return await Course.findById(id).populate({
      path: "users.enrolledCourses",
    }); // tryimg to get a course and all users enrolled in it
  }
  async getInstituteCourse(id) {
    console.log(id)
    const courses = await Course.find({
      instituteId: id,
      $or: [{ status: "public" }, { status: "private" }],
    });
    return courses;
  }
=======
    async rate(info) {
        let newRate = {
            userId: info.userId,
            rate: info.rate,
            comment: info.comment
        };
        const alreadyRate = await Course.findOne({ "ratings.userId": info.userId, "_id": info.courseId });
        if (alreadyRate)
            throw new CustomError(errors.You_Can_Not_Do_This);
        return await Course.findByIdAndUpdate(info.courseId, { $push: { ratings: newRate } }, { new: true });
    }
    async updateRate(courseId) {
        let res = await Course.aggregate([{ $unwind: "$ratings" }, { $group: { _id: courseId, rate: { $avg: "$ratings.rate" } } }]);
        return await Course.findByIdAndUpdate(courseId, { rate: res[0].rate }, { new: true });
    }
    async getAllCoursesByTeacherId(teacherId) {
        return await Course.find({ Teacher_ID: { $in: [teacherId] } });
    }
    async getAllUsersOfCourse(id) {
        return await Course.findById(id).populate({path:"users.enrolledCourses"});// tryimg to get a course and all users enrolled in it
    }
    async getById(id){
        return await Course.findById(id);
    }
    async changeStatus(id,status){
        return await Course.findByIdAndUpdate(id,{status:status},{new:true});
    }
>>>>>>> d192c03a5a87dc3a9b762792b5bcac24936c97d2
}
module.exports = CourseService;
