const express = require("express");
const {addCourse} = require("../controllers/addCourseController");
const verifyToken = require("../middlewares/verifyToken");
const router = express.Router();

router.post("/courses/add",addCourse);

module.exports = router;