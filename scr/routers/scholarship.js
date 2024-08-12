const express = require("express");
const router = express.Router();
const scholarshipController = require("./../controllers/scholarship");
const apiHandler = require("./../helpers/wrappers/api-handler");
router
  .route("/:id")
  .post(apiHandler(scholarshipController.createScholarship))
  .get(apiHandler(scholarshipController.getScholarship))
  .patch(apiHandler(scholarshipController.updateScholarship));
router
  .route("/:id/:instituteID")
  .delete(apiHandler(scholarshipController.deleteScholarship));
router
  .route("/instituteScholar/:id")
  .get(apiHandler(scholarshipController.getScholarshipByInstitute));

router.route("/").get(apiHandler(scholarshipController.getAll));

module.exports = router;
