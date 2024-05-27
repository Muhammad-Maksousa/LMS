const express = require("express");
const router = express.Router();
const article = require("./../controllers/articls");
const apiHandler = require("./../helpers/wrappers/api-handler");
const upload = require("../helpers/uplodSingleArticle");
router.route("/all").get(apiHandler(article.getAllAtricles));
router
  .route("/")
  .post(upload.single("path_file"), apiHandler(article.addArticle));
router
  .route("/:id")
  .get(apiHandler(article.getArticle))
  .patch(upload.single("path_file"), apiHandler(article.updateArticle))
  .delete(apiHandler(article.deleteArticle));

module.exports = router;
