const { Course, Video, Part , Assessment , Question} = require("../models/index");

exports.editCourse = async (req, res) => {
    const { courseId } = req.params;
    const { courseSummary, courseCategory, courseThumbnailPhoto, courseDescription, newPart } = req.body;

    try {
        // Update course details
        await Course.update(
            {
                courseSummary,
                courseCategory,
                courseThumbnailPhoto,
                courseDescription,
            },
            { where: { id: courseId } }
        );

        // Add a new part if provided
        if (newPart) {
            const { partName, videos, questions } = newPart;

            // Validate videos
            if (!videos || videos.length === 0) {
                return res.status(400).json({ message: "At least one video is required to add a new part" });
            }

            // Create the new part
            const part = await Part.create({ partName, courseId });

            // Add videos
            for (const video of videos) {
                await Video.create({
                    videoName: video.videoName,
                    videoFile: video.videoFile,
                    videoTime: video.videoTime,
                    videoStatus: "notStarted",
                    partId: part.id,
                });
            }

            // Add assessment and questions
            if (questions && Array.isArray(questions)) {
                const assessment = await Assessment.create({ partId: part.id });

                for (const question of questions) {
                    await Question.create({
                        assessmentId: assessment.id,
                        text: question.text,
                        options: question.options,
                        correctOption: question.correctOption,
                    });
                }
            }
        }

        res.status(200).json({ message: "Course updated successfully" });
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};


exports.editPart = async (req, res) => {
    const { partId } = req.params;
    const { partName, newVideo, questions } = req.body;

    try {
        // Update part name
        if (partName) {
            await Part.update({ partName }, { where: { id: partId } });
        }

        // Add new video
        if (newVideo) {
            await Video.create({
                videoName: newVideo.videoName,
                videoFile: newVideo.videoFile,
                videoTime: newVideo.videoTime,
                videoStatus: "notStarted",
                partId,
            });
        }

        // Add or update questions for the assessment
        if (questions && Array.isArray(questions)) {
            let assessment = await Assessment.findOne({ where: { partId } });

            // If no assessment exists, create one
            if (!assessment) {
                assessment = await Assessment.create({ partId });
            }

            // Add questions
            for (const question of questions) {
                await Question.create({
                    assessmentId: assessment.id,
                    text: question.text,
                    options: question.options,
                    correctOption: question.correctOption,
                });
            }
        }

        res.status(200).json({ message: "Part updated successfully" });
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};


exports.editVideo = async ( req, res ) => {
    const { videoId } = req.params;
    const { videoName, videoFile, videoTime } = req.body;
    try {
        await Video.update({ videoName , videoFile , videoTime },{where :{id : videoId}});
        res.status(200).json({ message: "Video updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: err.message });   
    }
}

exports.editQuestion = async (req, res) => {
    const { questionId } = req.params;
    const { text, options, correctOption } = req.body;

    try {
        // Update the question
        await Question.update(
            { text, options, correctOption },
            { where: { id: questionId } }
        );

        res.status(200).json({ message: "Question updated successfully" });
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};
