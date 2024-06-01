const express = require("express");
const router = express.Router();
const question = require("./../controllers/questions");
const apiHandler = require("./../helpers/wrappers/api-handler");
router.route("/all").get(apiHandler(question.getAllQuestions));
router.route("/").post(apiHandler(question.addQuestion));
router
  .route("/:id")
  .get(apiHandler(question.getQuestion))
  .patch(apiHandler(question.updateQuestion))
  .delete(apiHandler(question.deleteQuestion));

module.exports = router;
