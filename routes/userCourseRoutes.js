const { getAllUserCourses , getUserSingleCourses , startCourse } = require("../controllers/userCourseController");
const express = require('express')
const router = express.Router();

router.get("/getAllCourses/:userId" , getAllUserCourses );
router.get("/getSingleCourse/:userId/:courseId" , getUserSingleCourses );
router.post("/startCourse" , startCourse );

module.exports = router;