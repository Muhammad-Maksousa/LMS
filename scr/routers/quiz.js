const express = require("express");
const router = express.Router();
const Quiz = require("./../controllers/quiz");
const apiHandler = require("./../helpers/wrappers/api-handler");
router.route("/all").get(apiHandler(Quiz.getAllQuiz));
router.route("/").post(apiHandler(Quiz.addQuiz));
router
  .route("/:id")
  .get(apiHandler(Quiz.getQuiz))
  .patch(apiHandler(Quiz.updateQuiz))
  .delete(apiHandler(Quiz.deleteQuiz));
module.exports = router;
