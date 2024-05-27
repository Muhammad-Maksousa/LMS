const router = require("express").Router();

router.use("/user", require("./user"));
router.use("/course", require("./course"));
router.use("/course/video",require('./video'))
router.use('/course/article',require('./articls'))

//should be in the end of all routers
router.use("*", (req, res) => {
  res.status(404).json({ message: "The Page Not Found", httpStatusCode: 404 });
});
module.exports = router;

