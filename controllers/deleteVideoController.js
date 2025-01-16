const { Video, UserVideoStatus } = require('../models/index');

exports.deleteVideo = async (req, res) => {
    const { videoId } = req.params;

    try {
        // Delete video-related statuses
        await UserVideoStatus.destroy({ where: { videoId } });

        // Delete the video
        await Video.destroy({ where: { id: videoId } });

        res.status(200).json({ message: "Video deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};
