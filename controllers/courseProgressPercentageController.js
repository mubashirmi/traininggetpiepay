const { Course, Part, Video, UserVideoStatus, UserAssessment } = require('../models/index');

exports.getDetailedCourseProgress = async (req, res) => {
  console.log("dfffffffffffffffffff")
  const { userId, courseId } = req.params;
  try {
    // Fetch the course with its parts and videos
    const course = await Course.findOne({
      where: { id: courseId },
      include: [
        {
          model: Part,
          include: [
            { model: Video } // Fetch videos for each part; we will fetch user statuses separately.
          ]
        }
      ]
    });
    
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    
    let totalPartProgress = 0;
    let partsProgress = [];
    console.log(course.Parts.length)
    // Loop over each part of the course
    for (const part of course.Parts) {
      // For each part, determine the number of components: (# videos + 1 for assessment)
      const videos = part.Videos;
      const numVideos = videos.length;
      const componentCount = numVideos + 1; // +1 for assessment
      const componentWeight = 100 / componentCount; // weight (in percentage) for each component within the part
      
      let partProgress = 0;
      let videoDetails = [];
      
      // Process each video in the part
      for (const video of videos) {
        // Retrieve the user's progress record for the video
        const uvStatus = await UserVideoStatus.findOne({
          where: { userId, videoId: video.id }
        });
        
        // Ensure videoTime exists and is valid
        const totalDuration = video.videoTime; // in minutes
        if (!totalDuration || totalDuration <= 0) {
          console.log(`Skipping video ${video.id} due to invalid video time.`);
          continue;
        }

        let videoProgress = 0;
        if (uvStatus) {
          // Ensure currentTime is valid
          const currentTime = uvStatus.currentTime || 0;
          console.log(`User ${userId} progress for video ${video.id}: currentTime = ${currentTime}, totalDuration = ${totalDuration}`);
          
          // Calculate the fraction of the video that was watched
          videoProgress = Math.min((currentTime / totalDuration) * componentWeight, componentWeight);
        }
        partProgress += videoProgress;
        videoDetails.push({
          videoId: video.id,
          videoName: video.videoName,
          totalDuration,
          currentTime: uvStatus ? uvStatus.currentTime : 0,
          progress: videoProgress
        });
      }
      
      // For the assessment: Check if the user has completed it for this part.
      const userAssessment = await UserAssessment.findOne({
        where: { userId, partId: part.id, status: 'completed' }
      });
      const assessmentProgress = userAssessment ? componentWeight : 0;
      partProgress += assessmentProgress;

      console.log("Assessment Percentage ----->", assessmentProgress);
      
      // Save progress details for this part
      partsProgress.push({
        partId: part.id,
        partName: part.partName,
        progress: partProgress,  // part progress as a percentage (0 - 100)
        componentWeight,
        videoDetails,
        assessmentCompleted: !!userAssessment
      });
      
      totalPartProgress += partProgress;
    }
    
    // Overall course progress: average the progress of all parts.
    const overallCourseProgress = course.Parts.length > 0 ? (totalPartProgress / course.Parts.length) : 0;
    
    console.log(`Overall Course Progress: ${overallCourseProgress.toFixed(2)}%`);
    
    res.status(200).json({
      courseId: course.id,
      courseName: course.courseName,
      overallCourseProgress: overallCourseProgress.toFixed(2),
      parts: partsProgress
    });
  } catch (err) {
    console.error('Error calculating course progress:', err.message);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};
