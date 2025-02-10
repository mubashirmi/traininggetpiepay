const { User, UserCourseStatus, UserPartStatus, UserVideoStatus, UserAssessment, UserResponse, UserPartPdfStatus } = require("../models/index");

exports.deleteUser = async (req, res) => {
    const { userId } = req.params;

    try {
        // Delete user-related responses and assessments
        const userAssessments = await UserAssessment.findAll({ where: { userId } });
        for (const userAssessment of userAssessments) {
            await UserResponse.destroy({ where: { userAssessmentId: userAssessment.id } });
        }
        await UserAssessment.destroy({ where: { userId } });

        // Delete user-related statuses
        await UserCourseStatus.destroy({ where: { userId } });
        await UserPartStatus.destroy({ where: { userId } });
        await UserVideoStatus.destroy({ where: { userId } });
        await UserPartPdfStatus.destroy({ where: { userId } });

        // Finally, delete the user
        await User.destroy({ where: { id: userId } });

        res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};
