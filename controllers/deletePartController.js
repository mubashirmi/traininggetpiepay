const { Part, Video, UserPartStatus, UserVideoStatus, Assessment, Question, UserPartPdfStatus } = require("../models/index");

exports.deletePart = async (req, res) => {
    const { partId } = req.params;

    try {
        // Delete questions and assessment for the part
        const assessment = await Assessment.findOne({ where: { partId } });
        if (assessment) {
            await Question.destroy({ where: { assessmentId: assessment.id } });
            await Assessment.destroy({ where: { id: assessment.id } });
        }

        // Delete PDF status for this part
        await UserPartPdfStatus.destroy({ where: { partId } });

        // Find all videos linked to this part
        const videos = await Video.findAll({ where: { partId } });
        const videoIds = videos.map(video => video.id);

        // Delete video statuses using videoId instead of partId
        if (videoIds.length > 0) {
            await UserVideoStatus.destroy({ where: { videoId: videoIds } });
        }

        // Delete videos
        await Video.destroy({ where: { partId } });

        // Delete part statuses
        await UserPartStatus.destroy({ where: { partId } });

        // Finally, delete the part
        await Part.destroy({ where: { id: partId } });

        res.status(200).json({ message: "Part deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};

