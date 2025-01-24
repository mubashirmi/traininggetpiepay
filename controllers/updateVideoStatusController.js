const { User , Video , Part , Course , UserCourseStatus , UserPartStatus , UserVideoStatus } = require("../models/index");
const { Op, where } = require("sequelize");

exports.completeVideo = async (req, res) => {
    const { videoId, userId } = req.params;

    try {
        // 1. Mark the current video as "completed"
        await UserVideoStatus.update(
            { status: "completed" },
            { where: { userId, videoId } }
        );

        // 2. Find the current video and its part
        const currentVideo = await Video.findByPk(videoId);
        const currentPartId = currentVideo.partId;

        // 3. Find the next video in the same part
        const nextVideo = await Video.findOne({
            where: {
                partId: currentPartId,
                id: { [Op.gt]: videoId },
            },
            order: [['id', 'ASC']],
        });

        if (nextVideo) {
            // If a next video exists, mark it as "started"
            await UserVideoStatus.upsert({ userId, videoId: nextVideo.id, status: "started" });
        } else {
            // If no next video exists in the part
            // Mark the part as "completed"
            await UserPartStatus.update(
                { status: "completed" },
                { where: { userId, partId: currentPartId } }
            );

            // Find the next part in the course
            // const currentPart = await Part.findByPk(currentPartId);
            // const nextPart = await Part.findOne({
            //     where: {
            //         courseId: currentPart.courseId,
            //         id: { [Op.gt]: currentPartId },
            //     },
            //     order: [['id', 'ASC']],
            // });

            // if (nextPart) {
            //     // If a next part exists, mark it as "started"
            //     await UserPartStatus.upsert({ userId, partId: nextPart.id, status: "started" });

            //     // Mark the first video of the next part as "started"
            //     const firstVideoOfNextPart = await Video.findOne({
            //         where: { partId: nextPart.id },
            //         order: [['id', 'ASC']],
            //     });
            //     if (firstVideoOfNextPart) {
            //         await UserVideoStatus.upsert({
            //             userId,
            //             videoId: firstVideoOfNextPart.id,
            //             status: "started",
            //         });
            //     }
            // } else {
            //     // If no next part exists, mark the course as "completed"
            //     await UserCourseStatus.update(
            //         { status: "completed" },
            //         { where: { userId, courseId: currentPart.courseId } }
            //     );
            // }
        }

        res.status(200).json({ message: "Video status updated successfully" });
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};
