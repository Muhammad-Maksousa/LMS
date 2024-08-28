const Scholarship = require("./../models/Scholarship");
const {
  responseSender,
  updateResponseSender,
} = require("./../helpers/wrappers/response-sender");
const Institute = require("../models/institute");
module.exports = {
  createScholarship: async (req, res) => {
    const newScholarship = await Scholarship.create(req.body);
    instituteID = req.params.id;
    const institute = await Institute.findById(instituteID);
    institute.scholarship.push(newScholarship.id);
    institute.save();
    responseSender(res, "the scholar ship created succsfully");
  },
  getAll: async (req, res) => {
    const allScolarship = await Scholarship.find();
    responseSender(res, allScolarship);
  },
  getScholarship: async (req, res) => {
    const scholarship = await Scholarship.findById(req.params.id);
    responseSender(res, scholarship);
  },
  getScholarshipByInstitute: async (req, res) => {
    InstituteId = req.params.id;
    const ScolarInstitute = await Institute.findById(InstituteId)
            .populate({
                path: "scholarship",
                select: "name EndDate", // Adjust "lastChance" based on your Scholarship model's field name
            })
            .select("scholarship");
    responseSender(res, ScolarInstitute);
  },
  deleteScholarship: async (req, res) => {
    await Scholarship.findByIdAndDelete(req.params.id);
    const instituteID = req.params.instituteID;
    const institute = await Institute.findById(instituteID);
    institute.scholarship = institute.scholarship.filter(
      (scholarshipId) => scholarshipId.toString() !== req.params.id
    );
    await institute.save();
    responseSender(res, "Delete successful");
  },
  updateScholarship: async (req, res) => {
    console.log("The body is: " + JSON.stringify(req.body));

    try {
        const scholarship = await Scholarship.findByIdAndUpdate(req.params.id, req.body, {
            new: true,          // Return the modified document
            runValidators: true, // Ensure the update adheres to schema validation
            useFindAndModify: false
        });

        if (!scholarship) {
            return responseSender(res, "Scholarship not found", null, 404);
        }

        console.log("The update: ", scholarship); // Log the updated document
        responseSender(res, "Update successful", scholarship); // Return the updated scholarship
    } catch (error) {
        responseSender(res, "Update failed", error, 500);
    }
},
};
