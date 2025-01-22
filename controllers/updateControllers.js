const { Course, Video, Part } = require("../models/index");

exports.editCourse = async (req, res) => {
  const { courseId } = req.params;
  const { courseSummary, courseCategory, courseThumbnailPhoto, newPart } =
    req.body;
  try {
    await Course.update(
        {
            courseSummary,
            courseCategory,
            courseThumbnailPhoto,
        },
        {
            where : {id:courseId}
        }
    );
    if(newPart){
        const {partName , videos } = newPart;
        if (!videos || videos.length === 0) {
            return res.status(400).json({ message: "At least one video is required to add a new part" });
        }
        const part = await Part.create({partName,courseId});
        for(const video of videos){
            await Video.create({
                videoName: video.videoName,
                videoFile: video.videoFile,
                videoTime: video.videoTime,
                videoStatus: "notStarted", // Default status for new videos
                partId: part.id,
            })
        }

    }
    res.status(200).json({ message: "Course Updated Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internnal Server Error", error });
  }
};

exports.editPart = async (req,res) => {
    const { partId } = req.params;
    const {partName , newVideo } = req.body; 
    try {
        await Part.update({partName},{where : {id:partId}});
        if(newVideo){
            const { videoName, videoFile, videoTime } = newVideo;
            // Validate video fields
            if (!videoName || !videoFile || !videoTime) {
                return res.status(400).json({ message: "Invalid video data" });
            }
            await Video.create({
                videoName,
                videoFile,
                videoTime,
                videoStatus: "notStarted", // Default status for new videos
                partId,
            })
        }
    } catch (error) {
        res.status(500).json({ message: "Internnal Server Error", error });
    }
}

exports.editVideo = async ( req, res ) => {
    const { videoId } = req.params;
    const { videoName, videoFile, videoTime } = req.body;
    try {
        await Video.update({ videoName , videoFile , videoTime },{where :{id : videoId}});
        res.status(200).json({ message: "Video updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: err.message });   
    }
}