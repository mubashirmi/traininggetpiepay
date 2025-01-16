const express = require('express');
const { deleteUser } = require("../controllers/deleteUserController");
const { deleteCourse } = require("../controllers/deleteCourseController");
const { deletePart } = require("../controllers/deletePartController");
const { deleteVideo } = require("../controllers/deleteVideoController")

const router = express.Router();

router.delete("/deleteUser/:userId", deleteUser );
router.delete("/deleteCourse/:courseId", deleteCourse );
router.delete("/deletePart/:partId", deletePart );
router.delete("/deleteVideo/:videoId", deleteVideo );

module.exports =router