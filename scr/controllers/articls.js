const Article = require("./../models/article");
const fs = require("fs/promises");
const path = require("path");
const {
  responseSender,
  updateResponseSender,
} = require("./../helpers/wrappers/response-sender");
module.exports = {
  addArticle: async (req, res) => {
    let newArticle = { ...req.body };
    newArticle.path_file =
      "C:\\Users\\Eam Kadry\\Desktop\\ITE 4th\\مشروع 1\\LMS\\public\\article\\" +
      req.file.filename;
    newArticle = await Article.create(newArticle);
    responseSender(res, newArticle);
  },
  getAllAtricles: async (req, res) => {
    const articles = await Article.find();
    responseSender(res, articles);
  },
  getArticle: async (req, res) => {
    const article = await Article.findById(req.params.id);
    responseSender(res, article);
  },
  updateArticle: async (req, res) => {
    let article = { ...req.body };
    if (req.file) {
      article.path_file =
        "C:\\Users\\Eam Kadry\\Desktop\\ITE 4th\\مشروع 1\\LMS\\public\\article\\" +
        req.file.filename;
      article1 = await Article.findById(req.params.id);
      await fs.unlink(article1.path_file);
    }
    article = await Article.findByIdAndUpdate(req.params.id, article, {
      new: true,
      runValdiators: true,
    });

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
