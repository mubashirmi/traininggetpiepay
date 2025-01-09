const { Course, Part, Video } = require("../models/index");

exports.addCourse = async (req, res) => {
  const {
    courseName,
    courseCategory,
    courseThumbnailPhoto,
    courseSummary,
    parts,
  } = req.body;
  try {
    const course = await Course.create({
      courseName,
      courseCategory,
      courseThumbnailPhoto,
      courseSummary,
    });
    console.log(course);

    if (course && parts && Array.isArray(parts)) {
      for (const i of parts) {
        const part = await Part.create({
          partName: i.partName,
          courseId: course.id,
        });
        if (part && i.videos && Array.isArray(i.videos)) {
          for (const j of i.videos) {
            const video = await Video.create({
              videoName :j.videoName ,
              videoFile : j.videoFile,
              videoTime : j.videoTime,
              videoStatus : j.videoStatus,
              partId : part.id
            });
          }
        }
      }
    }
    res.status(201).json({message : "Course Created Successfully" , course})
  } catch (err) {
    res.status(500).json({message : "Internal Server Error" , error: err})
  }
};
