const Institute = require("../models/institute");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const secretKey = require("../helpers/db/config.secret");
const Scholarship = require("../models/Scholarship");
const JoinRequists = require("../models/joinRequists");
class InstituteService {
  constructor({
    credentialId,
    name,
    image,
    socialMediaAccounts,
    teachers,
    location,
    cost,
    wallet,
  }) {
    this.credentialId = credentialId;
    this.name = name;
    this.image = image;
    this.socialMediaAccounts = socialMediaAccounts;
    this.teachers = teachers;
    this.location = location;
    this.cost =cost
    this.wallet = wallet
  }
  async add() {
    const institute = new Institute({
      credentialId: this.credentialId,
      name: this.name,
      image: this.image,
      socialMediaAccounts: this.socialMediaAccounts,
      teachers: this.teachers,
      location: this.location,
      wallet: this.wallet,
      cost: this.cost
    });
    return await institute.save();
  }
  async update(id, updateData) {
    if (typeof updateData !== "object" || Array.isArray(updateData)) {
      throw new Error("Invalid data format for update");
    }

    const updatedInstitute = await Institute.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedInstitute) {
      console.error(`No Institute found with ID: ${id}`);
      return null;
    }

    return updatedInstitute;
  }
  async login(cred) {
    const institute = await Institute.findOne({
      credentialId: cred._id,
    }).populate("credentialId");
    let token = jwt.sign(
      { instituteId: institute._id, role: cred.role },
      secretKey,
      { expiresIn: "30 days" }
    );
    return { info: institute, token: token };
  }
  async getProfile(id) {
    return await Institute.findById(id).populate("credentialId");
  }
  async getAll() {
    return await Institute.find();
  }
  async acceptTeacher(instituteId, teacherId, startDate, endDate) {
    let teacher = {
      teacherId: teacherId,
      startDate: startDate,
      endDate: endDate,
    };
    return await Institute.findByIdAndUpdate(
      instituteId,
      { $push: { teachers: teacher } },
      { new: true }
    );
  }
  async getMyTeachers(instituteId) {
    return await Institute.findById(instituteId)
      .populate("teachers.teacherId")
      .select("teachers");
  }
  async acceptScholarshipStudenet(instituteId, scholarshipId, userId, approve) {
    if (!approve) {
      return 0;
    } else {
      const scholarship = await Scholarship.findById(scholarshipId);
      const endSubscription = scholarship.EndDate;
      let student = {
        studentId: userId,
        endDate: endSubscription,
      };
      // check befor if student exist before or not
      const isExist = await Institute.findOne({
        _id: instituteId,
        $or: [
          { "studentScholarship.studentId": userId },
          { "myStudent.studentId": userId },
          { "paidStudent.studentId": userId },
        ],
      });
      if (!isExist) {
        await Institute.findByIdAndUpdate(
          instituteId,
          { $push: { studentScholarship: student } },
          { new: true }
        );
        return 1;
      } else return 2;
    }
  }
  async removeScholarshipStudent(instituteId, usersId) {
    const result = await Institute.updateOne(
      { _id: instituteId }, // Find the institute by its ID
      {
        $pull: {
          studentScholarship: { studentId: { $in: usersId } },
        },
      }
    );
  }
  async addMystudent(instituteId, studentIds) {
    try {
      // Check if any of the students already exist in the arrays
      const existingStudents = await Institute.findOne(
        {
          _id: instituteId,
          $or: [
            { "studentScholarship.studentId": { $in: studentIds } },
            { "myStudent.studentId": { $in: studentIds } },
            { "paidStudent.studentId": { $in: studentIds } },
          ],
        },
        {
          "studentScholarship.studentId": 1,
          "myStudent.studentId": 1,
          "paidStudent.studentId": 1,
        }
      );

      // Extract the existing student IDs
      const existingStudentIds = new Set([
        ...(existingStudents?.studentScholarship.map((s) =>
          s.studentId.toString()
        ) || []),
        ...(existingStudents?.myStudent.map((s) => s.studentId.toString()) ||
          []),
        ...(existingStudents?.paidStudent.map((s) => s.studentId.toString()) ||
          []),
      ]);

      // Filter out studentIds that are already in any of the arrays
      const newStudents = studentIds.filter(
        (id) => !existingStudentIds.has(id.toString())
      );

      if (newStudents.length === 0) {
        console.log("All students already exist in one of the arrays.");
        return;
      }

      // Prepare the students to be added
      const studentsToAdd = newStudents.map((id) => ({
        studentId: id,
        startDate: Date.now(), // Automatically set startDate
      }));

      // Push the new students to the myStudent array
      const result = await Institute.updateOne(
        { _id: instituteId },
        {
          $push: {
            myStudent: {
              $each: studentsToAdd,
            },
          },
        }
      );
    } catch (error) {
      console.error("Error adding students to myStudent array:", error);
    }
  }
  async deleteMyStudent(instituteId,usersId){
    await Institute.updateOne(
        { _id: instituteId }, // Find the institute by its ID
        {
          $pull: {
            myStudent: { studentId: { $in: usersId } },
          },
        }
      );
  }
  async oneOfMyTeachers(teacherId,instituteId){
    return await Institute.find({"_id":instituteId,"teachers.teacherId":teacherId});
  }
  async acceptCourse(instituteId,courseId,status){
    
  }
}

module.exports = InstituteService;
