const router = require("express").Router();

router.use("/user", require("./user"));
router.use("/course", require("./course"));
router.use("/course/video",require('./video'));
router.use('/course/article',require('./articls'));
router.use('/course/quize/question',require('./questions'));
router.use('/course/quiz',require('./quiz'));
router.use("/teacher",require("./teacher"));
//should be in the end of all routers
router.use("*", (req, res) => {
  res.status(404).json({ message: "The Page Not Found", httpStatusCode: 404 });
});
module.exports = router;

