const {  Part ,Video ,UserPartStatus,UserVideoStatus , Assessment , Question} = require("../models/index");

exports.deletePart = async (req, res) => {
    const { partId } = req.params;

    try {
        // Delete questions and assessment for the part
        const assessment = await Assessment.findOne({ where: { partId } });
        if (assessment) {
            await Question.destroy({ where: { assessmentId: assessment.id } });
            await Assessment.destroy({ where: { id: assessment.id } });
        }

        // Delete videos and video statuses
        await UserVideoStatus.destroy({ where: { partId } });
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