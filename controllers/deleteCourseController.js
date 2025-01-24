const { Course,Part,Video,UserCourseStatus,UserPartStatus,UserVideoStatus , Assessment , Question } = require("../models/index");

exports.deleteCourse = async (req, res) => {
    const { courseId } = req.params;

    try {
        // Find all parts of the course
        const parts = await Part.findAll({ where: { courseId } });

        for (const part of parts) {
            // Delete questions and assessment for each part
            const assessment = await Assessment.findOne({ where: { partId: part.id } });
            if (assessment) {
                await Question.destroy({ where: { assessmentId: assessment.id } });
                await Assessment.destroy({ where: { id: assessment.id } });
            }

            // Delete videos and video statuses
            await UserVideoStatus.destroy({ where: { partId: part.id } });
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