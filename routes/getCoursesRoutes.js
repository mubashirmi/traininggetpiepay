const express = require("express");
const { getCourseById , getAllCourses } = require("../controllers/getCourseController");
const router = express.Router();

router.get("/getAllCourses", getAllCourses);
router.get("/getCourse/:id", getCourseById);

module.exports = router;