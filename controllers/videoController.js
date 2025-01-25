const { Course, Part, Video } = require('../models/index');

exports.getVideoFile = async (req, res) => {
    const { courseId, partId, videoId } = req.params;

    try {
        // Validate that the video belongs to the specified course and part
        const video = await Video.findOne({
            where: { id: videoId },
            include: [
                {
                    model: Part,
                    where: { id: partId, courseId },
                },
            ],
        });

        if (!video) {
            return res.status(404).json({ message: 'Video not found for the given course and part' });
        }

        // Send the video file link
        res.status(200).json({
            // videoId: video.id,
            // videoName: video.videoName,
            videoFile: video.videoFile,
        });
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
};
