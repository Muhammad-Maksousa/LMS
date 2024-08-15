const Course = require("./../models/course");
const User = require("../models/user");
const mongoose = require("mongoose");
const CustomError = require("../helpers/errors/custom-errors");
const errors = require("../helpers/errors/errors.json");
class CourseService {

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
    return await User.find({enrolledCourses:{$in:id}}).select(['firstName','lastName']); // tryimg to get a course and all users enrolled in it
  }
  async getInstituteCourse(id) {
    console.log(id)
    const courses = await Course.find({
      instituteId: id,
      $or: [{ status: "public" }, { status: "private" }],
    });
    return courses;
  }
  async getById(id){
    return await Course.findById(id);
}
async changeStatus(id,status){
    return await Course.findByIdAndUpdate(id,{status:status},{new:true});
}
async getOneCourse(id){
    const course = await Course.findById(id).populate("video").populate("article").populate("quiz");
    let resulte = []
    let lengthOfAllInfo = course.article.length + course.video.length + course.quiz.length;
    //name,id,type
    for(let i=1;i<+lengthOfAllInfo;i++){
      course.video.forEach(video => {
        if(video.order==i){
          let item = {
            id:video.id,
            name:video.name,
            type:'video'
          }
          resulte.push(item);
        }
      });
      course.article.forEach(article => {
        if(article.order==i){
          let item = {
            id:article.id,
            name:article.name,
            type:'article'
          }
          resulte.push(item);
        }
      });
      course.quiz.forEach(quiz => {
        if(quiz.order==i){
          let item = {
            id:quiz.id,
            name:quiz.name,
            type:'quiz'
          }
          resulte.push(item);
        }
      });
    }
    return resulte;
}
async getRate(id){
  return Course.findById(id).select('ratings').populate([{path:"ratings.userId",select:['firstName','lastName']}]);
}
}
module.exports = CourseService;
