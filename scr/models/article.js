const mongoose = require("mongoose");
const articleSchema = mongoose.Schema({
  title: { type: String, required: true },
  path_file: { type: String, required: true },
  author: { type: String },
  category: { type: String },
  createdAt: { type: Date, default: Date.now },
});
const Article = mongoose.model("Article", articleSchema);
module.exports = Article;
