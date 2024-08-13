const Article = require("./../models/article");
const fs = require("fs/promises");
const path = require("path");
const {
  responseSender,
  updateResponseSender,
} = require("./../helpers/wrappers/response-sender");
const Course = require("./../models/course")
module.exports = {
  addArticle: async (req, res) => {
    let newArticle = { ...req.body };
    newArticle.path_file =path.resolve(__dirname,'..','..','public','article',req.file.filename)
      
    newArticle = await Article.create(newArticle);
    responseSender(res, newArticle);
  },
  getAllAtricles: async (req, res) => {
    const courseId = req.params.id
    const articles = await Course.findById(courseId).select("article").populate("article");
    responseSender(res, articles);
  },
  getArticle: async (req, res) => {
    const article = await Article.findById(req.params.id);
    responseSender(res, article);
  },
  updateArticle: async (req, res) => {
    let article = { ...req.body };
    if (req.file) {
      article1 = await Article.findById(req.params.id);
      await fs.unlink(article1.path_file);
    }
    article = await Article.findByIdAndUpdate(req.params.id, article, {
      new: true,
      runValdiators: true,
    });
    article.path_file=path.resolve(__dirname,'..','..','public','article',req.file.filename)
    await article.save()

    res.status(201).json({
      status: "sucsses",
      result: article,
    });
  },
  deleteArticle: async (req, res) => {
    const article = await Article.findByIdAndDelete(req.params.id);
    await fs.unlink(article.path_file);
    res.status(204).json({
      status: "succses",
    });
  },
};
