const express = require("express");
const { editCourse , editPart , editVideo , editQuestion ,updatePdfStatus } = require("../controllers/updateControllers")
const router = express.Router();

router.put('/editCourse/:courseId', editCourse);
router.put('/editPart/:partId', editPart);
router.put('/editVideo/:videoId', editVideo);
router.put('/editQuestion/:questionId', editQuestion);
router.put('/editPartPdfStatus/:userId/:partId', updatePdfStatus);

module.exports = router;