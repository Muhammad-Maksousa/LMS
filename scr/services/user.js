const User = require("../models/user");
const roles = require("../helpers/roles");
const CustomError = require("../helpers/errors/custom-errors");
const errors = require("../helpers/errors/errors");
const jwt = require("jsonwebtoken");
const secretKey = require("../helpers/db/config.secret");
const mongoose=require('mongoose')
class UserService {
  constructor({ firstName, lastName, birthDate, image, credentialId, role }) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.birthDate = birthDate;
    this.image = image;
    this.credentialId = credentialId;
    this.role = role;
  }
  async add() {
    const user = new User({
      firstName: this.firstName,
      lastName: this.lastName,
      image: this.image,
      birthDate: Date.parse(this.birthDate),
      credentialId: this.credentialId,
      role: this.role,
    });
    return await user.save();
  }
  async update(id) {
    return User.findByIdAndUpdate(
      id,
      {
        firstName: this.firstName,
        lastName: this.lastName,
        image: this.image,
        birthDate: Date.parse(this.birthDate),
      },
      { new: true }
    ); //{new:true} to return data after update
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
  async enroll(courseId, userId) {
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
    const courseProgress = user.progress.find((prog) =>
      prog.courseID.equals(courseId)
    );
    if (courseProgress) {
      courseProgress.done.push(done);
      courseProgress.doneModel.push(model);
    } else {
        const courseProgress = user.progress.push({
          courseID: courseId,
          done:done,
          doneModel:model

          });
    
    // user.progress.course=new mongoose.Types.ObjectId(courseId)
    // user.progress.course.done=done
    // user.progress.course.doneModel=model
    }
    await User.findByIdAndUpdate(userId, user, { new: true, runValdiators:true });
    return user.progress;
  }
}

module.exports = UserService;
