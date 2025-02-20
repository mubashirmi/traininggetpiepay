const { User , Video , Part , Course , UserCourseStatus , UserPartStatus , UserVideoStatus } = require("../models/index");
const { Op } = require("sequelize");

exports.completeVideo = async (req, res) => {
    const { videoId, userId } = req.params;

    try {
        // 1. Mark the current video as "completed"
        const videoStatusUpdated = await UserVideoStatus.update(
            { status: "completed" },
            { where: { userId, videoId } }
        );

        if (videoStatusUpdated[0] === 0) {
            return res.status(400).json({ message: "Video is already completed or no status found." });
        }

        // 2. Find the current video and its part
        const currentVideo = await Video.findByPk(videoId);
        if (!currentVideo) {
            return res.status(404).json({ message: "Video not found" });
        }

        const currentPartId = currentVideo.partId;

        // Fetch the part associated with this video to get the courseId
        const part = await Part.findByPk(currentPartId);
        if (!part) {
            return res.status(404).json({ message: "Part not found" });
        }

        const courseId = part.courseId;  // Get the courseId from the part

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
            await UserVideoStatus.upsert({
                userId,
                videoId: nextVideo.id,
                status: "started"
            });
        } else {
            // If no next video exists in the part, mark the part as "completed"
            await UserPartStatus.update(
                { status: "completed" },
                { where: { userId, partId: currentPartId } }
            );

            // Find the next part in the course
            const nextPart = await Part.findOne({
                where: {
                    courseId: courseId,  // Use the courseId from the part
                    id: { [Op.gt]: currentPartId },
                },
                order: [['id', 'ASC']],
            });

            if (nextPart) {
                // If a next part exists, mark it as "started"
                await UserPartStatus.upsert({
                    userId,
                    partId: nextPart.id,
                    status: "started"
                });

                // Mark the first video of the next part as "started"
                const firstVideoOfNextPart = await Video.findOne({
                    where: { partId: nextPart.id },
                    order: [['id', 'ASC']],
                });

                if (firstVideoOfNextPart) {
                    await UserVideoStatus.upsert({
                        userId,
                        videoId: firstVideoOfNextPart.id,
                        status: "started",
                    });
                }
            } else {
                // If no next part exists, mark the course as "completed"
                await UserCourseStatus.update(
                    { status: "completed" },
                    { where: { userId, courseId: courseId } }
                );
            }
        }

        res.status(200).json({ message: "Video status updated successfully" });
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};