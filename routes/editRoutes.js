const express = require("express");
const { editCourse , editPart , editVideo , editQuestion } = require("../controllers/updateControllers")
const router = express.Router();

router.put('/editCourse/:courseId', editCourse);
router.put('/editPart/:partId', editPart);
router.put('/editVideo/:videoId', editVideo);
router.put('/editQuestion/:questionId', editQuestion);

module.exports = router;