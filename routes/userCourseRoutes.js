const { getAllUserCourses , startCourse } = require("../controllers/userCourseController");
const express = require('express')
const router = express.Router();

router.get("/getAllCourses/:userId" , getAllUserCourses );
router.post("/startCourse" , startCourse );

module.exports = router;