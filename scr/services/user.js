const User = require("../models/user");
const roles = require("../helpers/roles");
const CustomError = require("../helpers/errors/custom-errors");
const errors = require("../helpers/errors/errors.json");
const jwt = require("jsonwebtoken");
const secretKey = require("../helpers/db/config.secret");
const mongoose = require("mongoose");
const Course = require("../models/course");
const Institute = require("../models/institute");
const JoinRequists = require("../models/joinRequists");
const InstituteService = require("./Institute");
const AdminService = require("./admin");
const objectId = mongoose.Types.ObjectId
class UserService {
  constructor({
    firstName,
    lastName,
    birthDate,
    image,
    credentialId,
    role,
    wallet,
    fcm
  }) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.birthDate = birthDate;
    this.image = image;
    this.wallet = wallet;
    this.credentialId = credentialId;
    this.role = role;
    this.fcm = fcm;
  }
  async add() {
    const user = new User({
      firstName: this.firstName,
      lastName: this.lastName,
      wallet: this.wallet,
      image: this.image,
      birthDate: Date.parse(this.birthDate),
      credentialId: this.credentialId,
      role: this.role,
      fcm:this.fcm
    });
    return await user.save();
  }
  async update(id, updateData) {
    if (typeof updateData !== "object" || Array.isArray(updateData)) {
      throw new Error("Invalid data format for update");
    }
    return User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }); //{new:true} to return data after update
  }
  async login(cred) {
    const user = await User.findOne({ credentialId: cred._id }).populate(
      "credentialId"
    );
    let token = jwt.sign({ userId: user._id, role: cred.role }, secretKey, {
      expiresIn: "30 days",
    });
    return { info: user, token: token };
  }
  async enroll(courseId, userId,cost) {
    const user = User.findById(userId);
    if(user.wallet<cost)
      throw new CustomError(errors.You_Can_Not_Do_This);
    return await User.findByIdAndUpdate(
      userId,
      { $push: { enrolledCourses: courseId } },
      { new: true }
    );
  }
  async getMyEnrolledCourses(id) {
    return await User.findById(id)
      .select("enrolledCourses")
      .populate("enrolledCourses");
  }
  async finishCourse(courseId, userId) {
    const user = await User.findById(userId);
    const finishCourse = user.finishedCourses.includes(courseId);
    if (!finishCourse) {
      await User.findByIdAndUpdate(
        userId,
        { $pull: { enrolledCourses: courseId } },
        { new: true }
      );
      return await User.findByIdAndUpdate(
        userId,
        { $push: { finishedCourses: courseId } },
        { new: true }
      );
    } else {
      return;
    }
  }
  async getMyFinishedCourses(id) {
    return await User.findById(id)
      .select("finishedCourses")
      .populate("finishedCourses");
  }
  async getProfile(id) {
    return await User.findById(id)
      .populate("credentialId")
      .populate("enrolledCourses")
      .populate("finishedCourses");
  }
  async addToWishList(userId, courseId) {
    return await User.findByIdAndUpdate(
      userId,
      { $push: { wishlist: courseId } },
      { new: true }
    );
  }
  async deleteFromWishList(userId, courseId) {
    return await User.findByIdAndUpdate(
      userId,
      { $pull: { wishlist: courseId } },
      { new: true }
    );
  }
  async getWishList(id) {
    return await User.findById(id).select("wishlist").populate("wishlist");
  }

  async addToProgress(userId, courseId, done, model) {
    if (model === "fail") {
      return null;
    }
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    // count all content of course  To calculate a percentage
    const course = await Course.findById(courseId);
    let TotalNumberOfContent = 0;
    TotalNumberOfContent =
      course.video.length + course.article.length + course.quiz.length;
    // check if course exists or not
    const courseProgress = user.progress.find((prog) =>
      prog.courseID.equals(courseId)
    );
    if (courseProgress) {
      // Check if the done item exists in the current progress
      const existed = courseProgress.done.some((doneId) => doneId.equals(done));
      if (!existed) {
        // If the done item does not exist, add it
        courseProgress.done.push(done);
        courseProgress.doneModel.push(model);
        // count the number
        const countWhatDone = courseProgress.done.length;
        const percent = (countWhatDone / TotalNumberOfContent) * 100;
        courseProgress.percent = percent;
      }
    } else {
      const courseProgress = user.progress.push({
        courseID: courseId,
        done: done,
        doneModel: model,
        percent: (1 / TotalNumberOfContent) * 100,
      });
    }
    await User.findByIdAndUpdate(userId, user, {
      new: true,
      runValidators: true,
    });
    return courseProgress;
  }
  async subscribeToInstitute(studentId, instituteId) {
    const isExist = await Institute.findOne({
      _id: instituteId,
      $or: [
        { "studentScholarship.studentId": studentId },
        { "myStudent.studentId": studentId },
        { "paidStudent.studentId": studentId },
      ],
    }).lean();
    if (isExist) {
      return 0;
    } else {
      const institute = await Institute.findById(instituteId).lean();
      const student = await User.findById(studentId).lean();
      const cost = institute.cost;
      const studentWallet = student.wallet;
      if (studentWallet - cost >= 0) {
        let student1= {
          studentId:studentId,
          endDate: Date.now() + 365 * 24 * 60 * 60 * 100
        }
        await Institute.findByIdAndUpdate(
          instituteId,
          { $push: { paidStudent: student1 } },
          { new: true }
        );
        await User.findByIdAndUpdate(
          studentId,
          { $inc: { wallet: -cost } },
          { new: true }
        );
        await new InstituteService({}).updateWallet(instituteId,"money");
        //await new AdminService({}).updateWallet("money");TODO FOR ADMIN ID
        return 1;
      } else return 2;
    }
  }
  async getAllMessage(userId){
    return await User.findById(userId).select("message")
  }
  async deleteMessage(userId,messageId){
    const objectId = new mongoose.Types.ObjectId(messageId);
    return await User.findByIdAndUpdate(
      userId,
      { $pull: { message: { _id: objectId } } }, // Correct usage of $pull with a condition
      { new: true } // Return the updated document
    );
  }
  async getMessage(userId,messageId){
    const user = await User.findById(new objectId(userId));
    const message = user.message.find(msg => msg._id.toString() === messageId);
    return message
  }
  async getMyRequest(userId) {
    return await JoinRequists.find({
      "userToInstituteByGrant.userId": new mongoose.Types.ObjectId(userId)
  })
  .select(["userToInstituteByGrant.instituteId", "userToInstituteByGrant.scholarshipId"])
  .populate([
      { path: "userToInstituteByGrant.instituteId", select: ["name"] },
      { path: "userToInstituteByGrant.scholarshipId", select: ["name"] }
  ]);
};
async getAll(){
  return await User.find();
}
async getMyProgress(userId,courseId){
  return await User.find({_id:userId,"progress.courseID":courseId}).select("progress")
}
async isMyInstitute(id,instituteId){
  const exist = await Institute.findOne({id: instituteId,
      $or: [
        { "studentScholarship.studentId": id },
        { "myStudent.studentId": id },
        { "paidStudent.studentId": id },
      ],
    });
  if(exist)
    return true;
  else
  return false;
};
}

module.exports = UserService;
