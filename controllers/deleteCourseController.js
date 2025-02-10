const { Course, Part, Video, UserCourseStatus, UserPartStatus, UserVideoStatus, Assessment, Question, UserPartPdfStatus } = require("../models/index");

exports.deleteCourse = async (req, res) => {
    const { courseId } = req.params;

    try {
        // Find all parts of the course
        const parts = await Part.findAll({ where: { courseId } });
        console.log("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=", parts);

        for (const part of parts) {
            // Delete assessment and its questions
            const assessment = await Assessment.findOne({ where: { partId: part.id } });
            console.log(assessment);
            if (assessment) {
                await Question.destroy({ where: { assessmentId: assessment.id } });
                await Assessment.destroy({ where: { id: assessment.id } });
            }

            // Delete PDF statuses for this part
            await UserPartPdfStatus.destroy({ where: { partId: part.id } });

            // Find all videos in this part
            const videos = await Video.findAll({ where: { partId: part.id } });
            const videoIds = videos.map((video) => video.id);

            // Delete video statuses using videoId
            if (videoIds.length > 0) {
                await UserVideoStatus.destroy({ where: { videoId: videoIds } });
            }

            // Delete videos
            await Video.destroy({ where: { partId: part.id } });

            // Delete part statuses
            await UserPartStatus.destroy({ where: { partId: part.id } });
        }

        // Delete all parts
        await Part.destroy({ where: { courseId } });

        // Delete course statuses
        await UserCourseStatus.destroy({ where: { courseId } });

        // Finally, delete the course
        await Course.destroy({ where: { id: courseId } });

        res.status(200).json({ message: "Course deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};
