const { Course, Part, Video, UserVideoStatus } = require("../models/index");

exports.getCourseCompletionPercentage = async (req, res) => {
    const { userId, courseId } = req.params;

    try {
        // Fetch all parts and videos of the course
        const parts = await Part.findAll({
            where: { courseId },
            include: {
                model: Video,
                include: {
                    model: UserVideoStatus,
                    where: { userId, status: 'completed' },  // Only include videos that the user has completed
                    required: false,  // Include all videos even if not completed
                },
            },
        });

        // Calculate total time of all videos and completed videos
        let totalTime = 0;
        let completedTime = 0;

        parts.forEach(part => {
            part.Videos.forEach(video => {
                const videoTimeInMinutes = convertTimeToMinutes(video.videoTime);

                totalTime += videoTimeInMinutes;

                if (video.UserVideoStatuses && video.UserVideoStatuses.length > 0) {
                    completedTime += videoTimeInMinutes;
                }
            });
        });

        if (totalTime === 0) {
            return res.status(200).json({ message: "No videos found for this course" });
        }

        // Calculate the completion percentage
        const completionPercentage = (completedTime / totalTime) * 100;

        res.status(200).json({
            courseId,
            userId,
            completionPercentage: completionPercentage.toFixed(2), // rounding to 2 decimal points
            totalTime,
            completedTime,
        });
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};

// Helper function to convert time in HH:MM:SS format to minutes
const convertTimeToMinutes = (timeString) => {
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    return (hours * 60) + minutes + (seconds / 60);
};
